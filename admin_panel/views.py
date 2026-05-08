from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Count, Sum, Q, DecimalField
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from users.models import User
from restaurants.models import Restaurant, RestaurantRequest
from orders.models import Order
from payments.models import Payment
from .serializers import (
    UserSerializer,
    RestaurantRequestSerializer,
    RestaurantSerializer,
    OrderSerializer,
    PaymentSerializer,
    DashboardStatsSerializer,
    RevenueSummarySerializer,
)


class IsAdmin(IsAuthenticated):
    """Permission to check if user is admin"""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Get dashboard statistics"""
        now = timezone.now()
        today = now.date()
        week_ago = today - timedelta(days=7)

        total_users = User.objects.count()
        total_customers = User.objects.filter(role='customer').count()
        total_restaurants = Restaurant.objects.count()
        total_delivery_agents = User.objects.filter(role='delivery').count()

        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status__in=['pending', 'accepted', 'cooking']).count()
        completed_orders = Order.objects.filter(status='delivered').count()

        total_revenue = Order.objects.filter(
            status='delivered'
        ).aggregate(Sum('total'))['total__sum'] or 0

        pending_restaurant_requests = RestaurantRequest.objects.count()
        
        pending_delivery_approvals = User.objects.filter(
            role='delivery',
            is_active=False
        ).count()

        avg_order_value = 0
        if completed_orders > 0:
            avg_order_value = total_revenue / completed_orders

        daily_orders = Order.objects.filter(
            created_at__date=today
        ).count()

        weekly_revenue = Order.objects.filter(
            status='delivered',
            created_at__date__gte=week_ago
        ).aggregate(Sum('total'))['total__sum'] or 0

        serializer = DashboardStatsSerializer({
            'total_users': total_users,
            'total_customers': total_customers,
            'total_restaurants': total_restaurants,
            'total_delivery_agents': total_delivery_agents,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'total_revenue': total_revenue,
            'pending_restaurant_requests': pending_restaurant_requests,
            'pending_delivery_approvals': pending_delivery_approvals,
            'avg_order_value': avg_order_value,
            'daily_orders': daily_orders,
            'weekly_revenue': weekly_revenue,
        })

        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a user account"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'detail': 'User suspended successfully'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user account"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'detail': 'User activated successfully'})

    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """Get users filtered by role"""
        role = request.query_params.get('role')
        if role:
            queryset = User.objects.filter(role=role)
        else:
            queryset = User.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RestaurantRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = RestaurantRequestSerializer
    queryset = RestaurantRequest.objects.all()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a restaurant request"""
        request_obj = self.get_object()
        
        if not request_obj.owner:
            return Response(
                {'detail': 'Owner not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create restaurant
        restaurant = Restaurant.objects.create(
            owner=request_obj.owner,
            name=request_obj.name,
            logo=request_obj.logo,
            address=request_obj.address,
            city=request_obj.city,
            theme=request_obj.theme,
            is_active=True,
        )

        # Mark owner as restaurant role
        request_obj.owner.role = 'restaurant'
        request_obj.owner.save()

        # Delete request
        request_obj.delete()

        return Response({
            'detail': 'Restaurant approved successfully',
            'restaurant': RestaurantSerializer(restaurant).data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a restaurant request"""
        request_obj = self.get_object()
        reason = request.data.get('reason', 'Your request was rejected')
        # TODO: Send email to owner with reason
        request_obj.delete()
        return Response({
            'detail': 'Restaurant request rejected',
            'reason': reason
        })


class RestaurantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.all()

    @action(detail=True, methods=['post'])
    def toggle_open(self, request, pk=None):
        """Toggle restaurant open/close status"""
        restaurant = self.get_object()
        restaurant.is_active = not restaurant.is_active
        restaurant.save()
        return Response({
            'detail': f'Restaurant is now {"active" if restaurant.is_active else "inactive"}',
            'is_active': restaurant.is_active
        })

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a restaurant"""
        restaurant = self.get_object()
        restaurant.is_active = False
        restaurant.save()
        return Response({'detail': 'Restaurant suspended'})


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def get_queryset(self):
        queryset = Order.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=False, methods=['get'])
    def pending_orders(self, request):
        """Get all pending orders"""
        orders = Order.objects.filter(
            status__in=['pending', 'accepted', 'cooking']
        )
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get order summary"""
        summary = {
            'total': Order.objects.count(),
            'pending': Order.objects.filter(status__in=['pending', 'accepted', 'cooking']).count(),
            'completed': Order.objects.filter(status='delivered').count(),
            'cancelled': Order.objects.filter(status='cancelled').count(),
        }
        return Response(summary)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()

    def get_queryset(self):
        queryset = Payment.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=False, methods=['get'])
    def by_method(self, request):
        """Get payments by method"""
        method = request.query_params.get('method')
        if method:
            payments = Payment.objects.filter(method=method)
        else:
            payments = Payment.objects.all()
        
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)


class RevenueReportView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Get revenue report for date range"""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)

        report = Order.objects.filter(
            status='delivered',
            created_at__date__gte=start_date
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            total_orders=Count('id'),
            total_revenue=Sum('total'),
            completed_orders=Count('id', filter=Q(status='delivered')),
            average_order_value=Sum('total') / Count('id')
        ).order_by('date')

        return Response(list(report))


class DeliveryAgentApprovalView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Get pending delivery agent approvals"""
        agents = User.objects.filter(role='delivery', is_active=False)
        serializer = UserSerializer(agents, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Approve delivery agent"""
        agent_id = request.data.get('agent_id')
        try:
            agent = User.objects.get(id=agent_id, role='delivery')
            agent.is_active = True
            agent.save()
            return Response({
                'detail': 'Delivery agent approved',
                'agent': UserSerializer(agent).data
            })
        except User.DoesNotExist:
            return Response(
                {'detail': 'Agent not found'},
                status=status.HTTP_404_NOT_FOUND
            )
