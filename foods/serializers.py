from rest_framework import serializers
from .models import Food

class FoodSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    restaurant = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_image(self, obj):
        if getattr(obj, 'image', None):
            try:
                return obj.image.url
            except Exception:
                return str(obj.image)
        return None

    class Meta:
        model = Food
        fields = ['id', 'restaurant', 'title', 'price', 'image', 'is_available']
        read_only_fields = ['restaurant']
