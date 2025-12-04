from rest_framework import serializers
from orders.models import Order

class DeliveryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'customer', 'restaurant', 'total', 'status', 'assigned_delivery_boy', 'created_at']
        read_only_fields = ['customer', 'restaurant', 'total', 'created_at']
