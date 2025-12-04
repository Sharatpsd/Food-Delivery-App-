from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsCustomer, IsRestaurantOwner, IsDeliveryBoy

# -------------------------
# 1️⃣ Customer creates order
# -------------------------
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


# -------------------------
# 2️⃣ Customer sees own orders
# -------------------------
class CustomerOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by("-created_at")


# -------------------------
# 3️⃣ Restaurant sees own orders
# -------------------------
class RestaurantOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(restaurant__owner=self.request.user).order_by("-created_at")


# -------------------------
# 4️⃣ Restaurant updates order status
# -------------------------
class UpdateOrderStatusView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def post(self, request, pk):
        new_status = request.data.get("status")

        valid_status = ["accepted", "cooking", "on_the_way", "delivered"]
        if new_status not in valid_status:
            return Response({"detail": "Invalid status"}, status=400)

        order = Order.objects.filter(id=pk, restaurant__owner=request.user).first()
        if not order:
            return Response({"detail": "Order not found or not yours"}, status=404)

        order.status = new_status
        order.save()
        return Response({"detail": f"Status updated to {new_status}"})
        

# -------------------------
# 5️⃣ Customer cancels order (only if pending)
# -------------------------
class CancelOrderView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def post(self, request, pk):
        order = Order.objects.filter(id=pk, customer=request.user).first()

        if not order:
            return Response({"detail": "Order not found"}, status=404)

        if order.status != "pending":
            return Response({"detail": "Cannot cancel this order now"}, status=400)

        order.status = "cancelled"
        order.save()

        return Response({"detail": "Order cancelled"})


# -------------------------
# 6️⃣ Restaurant assigns delivery boy
# -------------------------
class AssignDeliveryBoyView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def post(self, request, pk):
        delivery_id = request.data.get("delivery_boy_id")

        order = Order.objects.filter(id=pk, restaurant__owner=request.user).first()
        if not order:
            return Response({"detail": "Order not found"}, status=404)

        from users.models import User
        delivery_boy = User.objects.filter(id=delivery_id, role="delivery").first()

        if not delivery_boy:
            return Response({"detail": "Delivery boy not found"}, status=400)

        order.assigned_delivery_boy = delivery_boy
        order.status = "on_the_way"
        order.save()

        return Response({"detail": "Delivery boy assigned"})


# -------------------------
# 7️⃣ Delivery boy marks order delivered
# -------------------------
class DeliveryCompleteView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, pk):
        order = Order.objects.filter(id=pk, assigned_delivery_boy=request.user).first()
        if not order:
            return Response({"detail": "Not your order"}, status=404)

        order.status = "delivered"
        order.save()

        return Response({"detail": "Order delivered"})
