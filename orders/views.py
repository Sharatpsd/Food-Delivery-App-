from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsRestaurantOwner, IsDeliveryBoy, IsCustomer
from restaurants.models import Restaurant

# Customer: Create Order
class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

# Customer: My Orders
class CustomerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by('-created_at')

# Restaurant: My Orders
class RestaurantOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def get_queryset(self):
        restaurant = Restaurant.objects.get(owner=self.request.user)
        return Order.objects.filter(restaurant=restaurant).order_by('-created_at')

# Restaurant: Update Order Status (accept, cooking, etc.)
class UpdateOrderStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        restaurant = Restaurant.objects.get(owner=request.user)
        
        if order.restaurant != restaurant:
            return Response({"detail": "Not your order"}, status=status.HTTP_403_FORBIDDEN)
            
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            
        return super().partial_update(request, *args, **kwargs)