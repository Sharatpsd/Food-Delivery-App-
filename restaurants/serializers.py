from rest_framework import serializers

from .models import Category, DeliveryRequest, Food, Restaurant, RestaurantRequest


def build_media_url(request, file_field, fallback_url):
    if file_field:
        local_url = file_field.url
        return request.build_absolute_uri(local_url) if request else local_url
    return fallback_url or None


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


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class FoodSerializer(serializers.ModelSerializer):
    image_final = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Food
        fields = "__all__"

    def get_image_final(self, obj):
        return build_media_url(self.context.get("request"), obj.image, obj.image_url)


class RestaurantSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = "__all__"

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)


class RestaurantListSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()
    food_count = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'city',
            'rating',
            'theme',
            'address',
            'logo_final',
            'food_count',
        ]

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)

    def get_food_count(self, obj):
        return obj.foods.filter(is_available=True).count()


class FoodMenuSerializer(serializers.ModelSerializer):
    image_final = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.name', read_only=True)
    restaurant = serializers.IntegerField(source='restaurant_id', read_only=True)

    class Meta:
        model = Food
        fields = [
            'id',
            'restaurant',
            'category',
            'name',
            'description',
            'price',
            'image',
            'image_url',
            'image_final',
            'is_available',
        ]

    def get_image_final(self, obj):
        return build_media_url(self.context.get("request"), obj.image, obj.image_url)


class RestaurantDetailSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()
    foods = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'city',
            'rating',
            'theme',
            'address',
            'logo',
            'logo_url',
            'logo_final',
            'foods',
        ]

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)

    def get_foods(self, obj):
        foods = obj.foods.filter(is_available=True).select_related('category').order_by('name')
        return FoodMenuSerializer(foods, many=True, context=self.context).data
