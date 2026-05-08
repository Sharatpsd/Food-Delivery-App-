from rest_framework import serializers
from django.db.models import Count, Sum, Q
from users.models import User
from restaurants.models import Restaurant, RestaurantRequest
from orders.models import Order, OrderItem
from payments.models import Payment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'email', 'phone', 'role', 'address', 'date_joined', 'is_active')
        read_only_fields = ('id', 'date_joined')


class RestaurantRequestSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)

    class Meta:
        model = RestaurantRequest
        fields = (
            'id', 'owner', 'owner_name', 'owner_email', 'name', 'logo',
            'address', 'city', 'avg_cost', 'theme', 'must_try',
            'timings', 'website', 'social', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class RestaurantSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    order_count = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = (
            'id', 'owner', 'owner_name', 'owner_email', 'name', 'logo',
            'address', 'city', 'avg_cost', 'is_active', 'rating',
            'order_count', 'total_revenue', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'order_count', 'total_revenue')

    def get_order_count(self, obj):
        return obj.restaurant_orders.count()

    def get_total_revenue(self, obj):
        total = obj.restaurant_orders.filter(
            status='delivered'
        ).aggregate(Sum('total'))['total__sum']
        return total or 0


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'food_name', 'quantity', 'price')


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    delivery_boy_name = serializers.CharField(source='assigned_delivery_boy.name', read_only=True, allow_null=True)
    items = OrderItemSerializer(source='order_items', many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'customer', 'customer_name', 'customer_email', 'restaurant',
            'restaurant_name', 'delivery_address', 'contact_phone', 'notes',
            'total', 'status', 'assigned_delivery_boy', 'delivery_boy_name',
            'items', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'items')


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    customer_name = serializers.CharField(source='order.customer.name', read_only=True)

    class Meta:
        model = Payment
        fields = (
            'id', 'order_id', 'customer_name', 'method', 'amount',
            'currency', 'status', 'transaction_id', 'provider',
            'gateway_response', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'gateway_response')


class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_restaurants = serializers.IntegerField()
    total_delivery_agents = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_restaurant_requests = serializers.IntegerField()
    pending_delivery_approvals = serializers.IntegerField()
    avg_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    daily_orders = serializers.IntegerField()
    weekly_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)


class RevenueSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    completed_orders = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
