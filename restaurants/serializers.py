from rest_framework import serializers
from .models import RestaurantRequest, DeliveryRequest, Restaurant, Food, Category


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


class RestaurantSerializer(serializers.ModelSerializer):

    logo_final = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = "__all__"

    def get_logo_final(self, obj):
        if obj.logo:
            return obj.logo.url
        if obj.logo_url:
            return obj.logo_url
        return None


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class FoodSerializer(serializers.ModelSerializer):

    image_final = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = "__all__"

    def get_image_final(self, obj):
        if obj.image:
            return obj.image.url
        if obj.image_url:
            return obj.image_url
        return None