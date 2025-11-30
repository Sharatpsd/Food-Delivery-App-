from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Payment
        fields = ['order_id', 'method', 'order', 'id']
        read_only_fields = ['order', 'id']