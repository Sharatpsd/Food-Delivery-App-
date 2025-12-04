from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, Count
from datetime import date

from orders.models import Order
from .serializers import DeliveryOrderSerializer
from users.permissions import IsDeliveryBoy

# LIST assigned & available orders
class AssignedOrdersListView(generics.ListAPIView):
    """
    List orders assigned to the current delivery boy (all statuses except cancelled).
    """
    serializer_class = DeliveryOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def get_queryset(self):
        return Order.objects.filter(assigned_delivery_boy=self.request.user).exclude(status='cancelled').order_by('-created_at')


# OPTIONAL: show orders assigned but not yet accepted by delivery boy
class PendingAssignedOrdersView(generics.ListAPIView):
    serializer_class = DeliveryOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def get_queryset(self):
        # assigned to this delivery boy but still pending or accepted (not delivered)
        return Order.objects.filter(assigned_delivery_boy=self.request.user).exclude(status__in=['delivered', 'cancelled']).order_by('-created_at')


# DELIVERY ACTIONS: accept / start / complete
class AcceptOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, pk):
        """
        Accept an assigned order.
        If order has no assigned_delivery_boy, prevent acceptance.
        """
        order = Order.objects.filter(id=pk, assigned_delivery_boy=request.user).first()
        if not order:
            return Response({"detail": "Order not assigned to you."}, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ['pending', 'accepted']:
            return Response({"detail": f"Cannot accept order in status {order.status}."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'accepted'
        order.save()
        return Response({"detail": "Order accepted."}, status=status.HTTP_200_OK)


class StartDeliveryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, pk):
        """
        Mark the order as 'on_the_way'. Only assigned delivery boy can do this.
        """
        with transaction.atomic():
            order = Order.objects.select_for_update().filter(id=pk, assigned_delivery_boy=request.user).first()
            if not order:
                return Response({"detail": "Order not assigned to you."}, status=status.HTTP_404_NOT_FOUND)

            if order.status not in ['accepted', 'cooking', 'pending']:
                return Response({"detail": f"Cannot start delivery from status {order.status}."}, status=status.HTTP_400_BAD_REQUEST)

            order.status = 'on_the_way'
            order.save()

        return Response({"detail": "Delivery started. Status set to on_the_way."}, status=status.HTTP_200_OK)


class CompleteDeliveryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, pk):
        """
        Mark the order as delivered. Only assigned delivery boy can do this.
        Uses transaction to avoid race conditions.
        """
        with transaction.atomic():
            order = Order.objects.select_for_update().filter(id=pk, assigned_delivery_boy=request.user).first()
            if not order:
                return Response({"detail": "Order not assigned to you."}, status=status.HTTP_404_NOT_FOUND)

            if order.status == 'delivered':
                return Response({"detail": "Order already marked delivered."}, status=status.HTTP_400_BAD_REQUEST)

            if order.status == 'cancelled':
                return Response({"detail": "Order is cancelled."}, status=status.HTTP_400_BAD_REQUEST)

            # finalize
            order.status = 'delivered'
            order.save()

        return Response({"detail": "Order marked as delivered."}, status=status.HTTP_200_OK)


# DASHBOARD: stats & earnings
class DeliveryDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def get(self, request):
        user = request.user
        today = date.today()

        # Orders assigned to this delivery boy
        orders = Order.objects.filter(assigned_delivery_boy=user)

        total_assigned = orders.count()
        pending = orders.filter(status='pending').count()
        accepted = orders.filter(status='accepted').count()
        on_the_way = orders.filter(status='on_the_way').count()
        delivered = orders.filter(status='delivered').count()
        cancelled = orders.filter(status='cancelled').count()

        # Earnings: sum of totals of delivered orders (optionally apply commission)
        total_earnings = orders.filter(status='delivered').aggregate(total=Sum('total'))['total'] or 0
        today_earnings = orders.filter(status='delivered', created_at__date=today).aggregate(total=Sum('total'))['total'] or 0

        # Today deliveries count
        today_deliveries = orders.filter(status='delivered', created_at__date=today).count()

        # Recent assigned orders (last 5)
        recent_orders_qs = orders.order_by('-created_at')[:5]
        recent_orders = DeliveryOrderSerializer(recent_orders_qs, many=True).data

        payload = {
            "assigned_summary": {
                "total_assigned": total_assigned,
                "pending": pending,
                "accepted": accepted,
                "on_the_way": on_the_way,
                "delivered": delivered,
                "cancelled": cancelled,
            },
            "earnings": {
                "total_earnings": float(total_earnings),
                "today_earnings": float(today_earnings),
                "today_deliveries": today_deliveries
            },
            "recent_orders": recent_orders
        }

        return Response(payload, status=status.HTTP_200_OK)
