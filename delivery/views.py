from rest_framework import generics, permissions
from orders.models import Order
from .serializers import DeliveryOrderSerializer
from users.permissions import IsDeliveryBoy
from rest_framework.response import Response
from rest_framework import status

class DeliveryBoyOrdersView(generics.ListAPIView):
    serializer_class = DeliveryOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def get_queryset(self):
        return Order.objects.filter(assigned_delivery_boy=self.request.user).order_by('-created_at')


class DeliverOrderView(generics.UpdateAPIView):
    serializer_class = DeliveryOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]
    queryset = Order.objects.all()

    def perform_update(self, serializer):
        order = self.get_object()
        # ensure order is assigned to this delivery boy
        if order.assigned_delivery_boy != self.request.user:
            raise PermissionError("This order is not assigned to you.")
        # update to delivered (or whatever status passed)
        serializer.save(status="delivered")
