from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField(read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_logo(self, obj):
        if obj.logo:
            try:
                return obj.logo.url
            except Exception:
                return str(obj.logo)
        return None

    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'name', 'logo', 'address', 'rating',
            'avg_cost', 'theme', 'must_try', 'timings', 'city',
            'website', 'social', 'is_open', 'latitude', 'longitude',
            'delivery_time_estimate', 'updated_at'
        ]
        read_only_fields = ['owner', 'rating', 'updated_at']
