from django.db import transaction
from rest_framework import serializers

from restaurants.models import Food, Restaurant

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    food_id = serializers.IntegerField(source='food.id', read_only=True)
    food_name = serializers.CharField(source='food.name', read_only=True)
    restaurant_id = serializers.IntegerField(source='food.restaurant_id', read_only=True)
    price = serializers.DecimalField(
        source='food.price',
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'food_id', 'food_name', 'restaurant_id', 'quantity', 'price', 'line_total']

    def get_line_total(self, obj):
        return obj.food.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    restaurant_id = serializers.IntegerField(source='restaurant.id', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'restaurant_id', 'restaurant_name', 'item_count', 'total', 'items', 'updated_at']

    def get_total(self, obj):
        return sum(item.food.price * item.quantity for item in obj.items.all())

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class CartAddSerializer(serializers.Serializer):
    food_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate(self, attrs):
        food = Food.objects.select_related('restaurant').filter(
            id=attrs['food_id'],
            is_available=True,
            restaurant__is_active=True,
        ).first()

        if not food:
            raise serializers.ValidationError({"food_id": "Food item not found or unavailable."})

        attrs['food'] = food
        return attrs


class CartUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    food_id = serializers.IntegerField(write_only=True)
    food_name = serializers.CharField(source='food.name', read_only=True)
    food_price = serializers.DecimalField(
        source='food.price',
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = ['food_id', 'food_name', 'food_price', 'quantity', 'price']
        read_only_fields = ['price', 'food_name', 'food_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True, required=False)
    items_detail = OrderItemSerializer(source='order_items', many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'customer_name',
            'restaurant',
            'restaurant_name',
            'delivery_address',
            'contact_phone',
            'notes',
            'items',
            'items_detail',
            'total',
            'status',
            'assigned_delivery_boy',
            'created_at',
        ]
        read_only_fields = [
            'customer',
            'total',
            'status',
            'created_at',
            'customer_name',
            'restaurant_name',
            'assigned_delivery_boy',
        ]

    def _get_cart(self, user):
        return Cart.objects.filter(user=user).select_related('restaurant').prefetch_related(
            'items__food'
        ).first()

    def validate(self, attrs):
        request = self.context['request']
        restaurant = attrs.get('restaurant')
        items_data = attrs.get('items')
        delivery_address = attrs.get('delivery_address') or getattr(request.user, 'address', '')

        if not delivery_address:
            raise serializers.ValidationError(
                {"delivery_address": "Delivery address is required for checkout."}
            )

        if items_data and not restaurant:
            raise serializers.ValidationError(
                {"restaurant": "Restaurant is required when ordering specific items."}
            )

        if not items_data:
            cart = self._get_cart(request.user)
            if not cart or not cart.items.exists() or not cart.restaurant_id:
                raise serializers.ValidationError({"items": "Your cart is empty."})

        return attrs

    def create(self, validated_data):
        customer = self.context['request'].user
        items_data = validated_data.pop('items', None)
        restaurant = validated_data.get('restaurant')
        delivery_address = validated_data.get('delivery_address') or customer.address
        contact_phone = validated_data.get('contact_phone') or customer.phone
        notes = validated_data.get('notes', '')

        cart = None
        if items_data:
            if not Restaurant.objects.filter(id=restaurant.id, is_active=True).exists():
                raise serializers.ValidationError({"restaurant": "Restaurant not found."})
            rest = restaurant
        else:
            cart = self._get_cart(customer)
            if not cart or not cart.restaurant or not cart.items.exists():
                raise serializers.ValidationError({"items": "Your cart is empty."})
            rest = cart.restaurant

        with transaction.atomic():
            order = Order.objects.create(
                customer=customer,
                restaurant=rest,
                delivery_address=delivery_address,
                contact_phone=contact_phone,
                notes=notes,
                total=0,
                status='pending',
            )

            total_amount = 0
            if items_data:
                order_items = items_data
            else:
                order_items = [
                    {"food_id": item.food_id, "quantity": item.quantity}
                    for item in cart.items.all()
                ]

            for item in order_items:
                food_id = item.get('food_id')
                quantity = item.get('quantity', 1)

                food = Food.objects.select_for_update().filter(
                    id=food_id,
                    restaurant=rest,
                    is_available=True,
                ).first()

                if not food:
                    raise serializers.ValidationError(
                        {"items": f"Food id {food_id} not found in this restaurant."}
                    )

                item_price = food.price * quantity
                total_amount += item_price

                OrderItem.objects.create(
                    order=order,
                    food=food,
                    quantity=quantity,
                    price=item_price,
                )

            order.total = total_amount
            order.save(update_fields=['total'])

            if cart:
                cart.items.all().delete()
                cart.restaurant = None
                cart.save(update_fields=['restaurant', 'updated_at'])

        return order
