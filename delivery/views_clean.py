from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from orders.models import Order
from users.permissions import IsDeliveryBoy
from .serializers import DeliveryOrderSerializer


class AssignedOrdersListView(generics.ListAPIView):
    """
    GET /api/delivery/assigned-orders/
    
    List all orders assigned to the current delivery partner.
    Excludes cancelled orders.
    
    Permissions:
    - IsAuthenticated
    - role == 'delivery'
    """
    serializer_class = DeliveryOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]
    pagination_class = None

    def get_queryset(self):
        """
        Return orders assigned to current delivery user,
        excluding cancelled, with optimized queries.
        """
        return Order.objects.filter(
            assigned_delivery_boy=self.request.user
        ).exclude(
            status='cancelled'
        ).select_related(
            'customer', 'restaurant', 'assigned_delivery_boy'
        ).prefetch_related(
            'order_items__food'
        ).order_by('-created_at')


class CompleteDeliveryView(APIView):
    """
    POST /api/delivery/complete-delivery/<int:id>/
    
    Mark an order as delivered.
    Only the assigned delivery partner can mark their own orders.
    
    Permissions:
    - IsAuthenticated
    - role == 'delivery'
    - User must be assigned to the order
    """
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, id):
        """
        Mark order as delivered.
        
        Args:
            id: Order ID
            
        Returns:
            200: Order successfully marked as delivered
            404: Order not found or not assigned to user
            400: Order already delivered or invalid status
        """
        # Use select_for_update to prevent race conditions
        with transaction.atomic():
            order = Order.objects.select_for_update().filter(
                id=id,
                assigned_delivery_boy=request.user
            ).first()

            # Order not found or not assigned to user
            if not order:
                return Response(
                    {"detail": "Order not found or not assigned to you."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if already delivered
            if order.status == 'delivered':
                return Response(
                    {"detail": "Order is already marked as delivered."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if cancelled
            if order.status == 'cancelled':
                return Response(
                    {"detail": "Cannot complete a cancelled order."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Mark as delivered
            order.status = 'delivered'
            order.save(update_fields=['status'])

        # Return updated order
        serializer = DeliveryOrderSerializer(order)
        return Response(
            {
                "detail": "Order marked as delivered successfully.",
                "order": serializer.data
            },
            status=status.HTTP_200_OK
        )
