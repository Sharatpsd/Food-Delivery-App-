from rest_framework import generics, permissions, status
from rest_framework.response import Response

from users.permissions import IsCustomer, IsDeliveryBoy, IsRestaurantOwner
from users.throttling import OrdersThrottle

from .models import Cart, CartItem, Order
from .serializers import CartAddSerializer, CartSerializer, CartUpdateSerializer, OrderSerializer


def get_or_create_customer_cart(user):
    return Cart.objects.get_or_create(user=user)


class CartSummaryView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    serializer_class = CartSerializer
    throttle_classes = [OrdersThrottle]

    def get_object(self):
        cart, _ = get_or_create_customer_cart(self.request.user)
        return Cart.objects.select_related('restaurant').prefetch_related('items__food').get(pk=cart.pk)


class CartAddView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    serializer_class = CartAddSerializer
    throttle_classes = [OrdersThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        food = serializer.validated_data['food']
        quantity = serializer.validated_data['quantity']

        cart, _ = get_or_create_customer_cart(request.user)

        if cart.restaurant and cart.restaurant_id != food.restaurant_id and cart.items.exists():
            return Response(
                {"detail": "Please clear your cart before ordering from another restaurant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cart.restaurant_id != food.restaurant_id:
            cart.restaurant = food.restaurant
            cart.save(update_fields=['restaurant', 'updated_at'])

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            food=food,
            defaults={'quantity': quantity},
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])

        cart = Cart.objects.select_related('restaurant').prefetch_related('items__food').get(pk=cart.pk)
        return Response(CartSerializer(cart).data)


class CartItemDetailView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    throttle_classes = [OrdersThrottle]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user).select_related(
            'cart', 'cart__restaurant', 'food'
        )

    def patch(self, request, pk):
        serializer = CartUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = self.get_queryset().filter(pk=pk).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.quantity = serializer.validated_data['quantity']
        item.save(update_fields=['quantity'])

        cart = Cart.objects.select_related('restaurant').prefetch_related('items__food').get(pk=item.cart_id)
        return Response(CartSerializer(cart).data)

    def delete(self, request, pk):
        item = self.get_queryset().filter(pk=pk).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        cart = item.cart
        item.delete()

        if not cart.items.exists():
            cart.restaurant = None
            cart.save(update_fields=['restaurant', 'updated_at'])

        cart = Cart.objects.select_related('restaurant').prefetch_related('items__food').get(pk=cart.pk)
        return Response(CartSerializer(cart).data)


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    throttle_classes = [OrdersThrottle]

    def get_serializer_context(self):
        return {"request": self.request}


class CustomerOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    serializer_class = OrderSerializer
    throttle_classes = [OrdersThrottle]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).select_related(
            'customer', 'restaurant', 'assigned_delivery_boy'
        ).prefetch_related(
            'order_items__food'
        ).order_by("-created_at")


class RestaurantOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    serializer_class = OrderSerializer
    throttle_classes = [OrdersThrottle]

    def get_queryset(self):
        return Order.objects.filter(restaurant__owner=self.request.user).select_related(
            'customer', 'restaurant', 'assigned_delivery_boy'
        ).prefetch_related(
            'order_items__food'
        ).order_by("-created_at")


class UpdateOrderStatusView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def post(self, request, pk):
        new_status = request.data.get("status")

        valid_status = ["accepted", "cooking", "on_the_way", "delivered"]
        if new_status not in valid_status:
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.filter(id=pk, restaurant__owner=request.user).first()
        if not order:
            return Response({"detail": "Order not found or not yours"}, status=status.HTTP_404_NOT_FOUND)

        order.status = new_status
        order.save(update_fields=['status'])
        return Response({"detail": f"Status updated to {new_status}"})


class CancelOrderView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def post(self, request, pk):
        order = Order.objects.filter(id=pk, customer=request.user).first()

        if not order:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if order.status != "pending":
            return Response({"detail": "Cannot cancel this order now"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "cancelled"
        order.save(update_fields=['status'])

        return Response({"detail": "Order cancelled"})


class AssignDeliveryBoyView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def post(self, request, pk):
        delivery_id = request.data.get("delivery_boy_id")

        order = Order.objects.filter(id=pk, restaurant__owner=request.user).first()
        if not order:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        from users.models import User

        delivery_boy = User.objects.filter(id=delivery_id, role="delivery").first()
        if not delivery_boy:
            return Response({"detail": "Delivery boy not found"}, status=status.HTTP_400_BAD_REQUEST)

        order.assigned_delivery_boy = delivery_boy
        order.status = "on_the_way"
        order.save(update_fields=['assigned_delivery_boy', 'status'])

        return Response({"detail": "Delivery boy assigned"})


class DeliveryCompleteView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsDeliveryBoy]

    def post(self, request, pk):
        order = Order.objects.filter(id=pk, assigned_delivery_boy=request.user).first()
        if not order:
            return Response({"detail": "Not your order"}, status=status.HTTP_404_NOT_FOUND)

        order.status = "delivered"
        order.save(update_fields=['status'])

        return Response({"detail": "Order delivered"})
