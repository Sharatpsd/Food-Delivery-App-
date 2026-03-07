from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source="order.id", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order_id",
            "method",
            "provider",
            "transaction_id",
            "gateway_url",
            "session_key",
            "amount",
            "currency",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "provider",
            "status",
            "transaction_id",
            "gateway_url",
            "session_key",
            "amount",
            "currency",
            "created_at",
        ]
