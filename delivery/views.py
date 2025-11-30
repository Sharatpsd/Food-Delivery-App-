from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsDeliveryBoy
from orders.models import Order
from orders.serializers import OrderSerializer

class DeliveryBoyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsDeliveryBoy]

    def get_queryset(self):
        return Order.objects.filter(
            assigned_delivery_boy=self.request.user,
            status__in=['accepted', 'cooking', 'on_the_way']
        )

class DeliverOrderView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsDeliveryBoy]

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.assigned_delivery_boy != request.user:
            return Response({"detail": "Not assigned to you"}, status=403)
        order.status = 'delivered'
        order.save()
        return Response({"detail": "Order delivered successfully"})