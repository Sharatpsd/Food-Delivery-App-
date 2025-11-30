from rest_framework import serializers
from .models import Order, OrderItem
from foods.models import Food


class OrderItemSerializer(serializers.ModelSerializer):
    food_id = serializers.IntegerField(write_only=True)
    food_title = serializers.CharField(source='food.title', read_only=True)
    food_price = serializers.DecimalField(source='food.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['food_id', 'food_title', 'food_price', 'quantity', 'price']
        read_only_fields = ['price', 'food_title', 'food_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    items_detail = OrderItemSerializer(source='order_items', many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'restaurant', 'restaurant_name',
            'items', 'items_detail', 'total', 'status', 'assigned_delivery_boy',
            'created_at'
        ]
        read_only_fields = ['total', 'status', 'created_at', 'customer_name', 'restaurant_name']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        restaurant = validated_data['restaurant']

        order = Order.objects.create(**validated_data, total=0)
        total_amount = 0

        for item_data in items_data:
            food = Food.objects.get(id=item_data['food_id'], restaurant=restaurant)
            item_price = food.price * item_data['quantity']
            total_amount += item_price

            OrderItem.objects.create(
                order=order,
                food=food,
                quantity=item_data['quantity'],
                price=item_price
            )

        order.total = total_amount
        order.save()
        return order