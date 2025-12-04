from rest_framework import serializers
from orders.models import Order, OrderItem
from foods.serializers import FoodSerializer  # optional, only if exists

class DeliveryOrderItemSerializer(serializers.ModelSerializer):
    food_title = serializers.CharField(source='food.title', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_title', 'quantity', 'price']


class DeliveryOrderSerializer(serializers.ModelSerializer):
    items = DeliveryOrderItemSerializer(source='order_items', many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'restaurant', 'restaurant_name',
            'items', 'total', 'status', 'assigned_delivery_boy', 'created_at'
        ]
        read_only_fields = ['customer', 'restaurant', 'items', 'total', 'created_at']
