from rest_framework import serializers
from orders.models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.name', read_only=True)
    food_price = serializers.DecimalField(
        source='food.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'food_price', 'quantity', 'price']
        read_only_fields = ['food_name', 'food_price', 'price']


class DeliveryOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for delivery partners to view assigned orders.
    Shows order details with items and customer info.
    """
    items_detail = OrderItemSerializer(source='order_items', many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'customer_name',
            'customer_phone',
            'restaurant',
            'restaurant_name',
            'items_detail',
            'total',
            'status',
            'assigned_delivery_boy',
            'created_at',
        ]
        read_only_fields = fields

