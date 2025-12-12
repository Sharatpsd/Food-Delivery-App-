from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
# from foods.models import Food
from restaurants.models import Restaurant

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
        read_only_fields = ['total', 'status', 'created_at', 'customer_name', 
                            'restaurant_name', 'assigned_delivery_boy']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        restaurant = validated_data.get('restaurant')
        customer = self.context['request'].user

        # Restaurant check
        if not Restaurant.objects.filter(id=restaurant.id).exists():
            raise serializers.ValidationError({"restaurant": "Restaurant not found."})

        rest = Restaurant.objects.get(id=restaurant.id)

        # Restaurant open?
        if hasattr(rest, "is_open") and not rest.is_open:
            raise serializers.ValidationError({"restaurant": "Restaurant is currently closed."})

        # Atomic Order Create
        with transaction.atomic():
            order = Order.objects.create(
                customer=customer,
                restaurant=rest,
                total=0,
                status='pending'
            )

            total_amount = 0

            for item in items_data:
                food_id = item.get('food_id')
                quantity = item.get('quantity', 1)

                food = Food.objects.select_for_update().filter(
                    id=food_id, restaurant=rest
                ).first()

                if not food:
                    raise serializers.ValidationError({"items": f"Food ID {food_id} not found in this restaurant."})

                if not food.is_available:
                    raise serializers.ValidationError({"items": f"{food.title} is not available."})

                item_price = food.price * quantity
                total_amount += item_price

                OrderItem.objects.create(
                    order=order,
                    food=food,
                    quantity=quantity,
                    price=item_price
                )

            order.total = total_amount
            order.save()

        return order
