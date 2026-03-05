from rest_framework import serializers
from .models import RestaurantRequest, DeliveryRequest, Restaurant, Food


class RestaurantRequestSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RestaurantRequest
        fields = "__all__"
        read_only_fields = ("approved", "created_at", "owner")


class DeliveryRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DeliveryRequest
        fields = "__all__"
        read_only_fields = ("approved", "created_at", "user")


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = "__all__"
        read_only_fields = ("created_at",)

class RestaurantSerializer(serializers.ModelSerializer):

    logo = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = "__all__"

    def get_logo(self, obj):
        return obj.get_logo()