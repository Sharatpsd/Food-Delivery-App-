# restaurants/serializers.py

from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    def get_logo(self, obj):
        if obj.logo:
            return obj.logo.url  # এটাই ম্যাজিক — Cloudinary তে যে URL আছে, সেটা রিটার্ন করবে
        return None

    class Meta:
        model = Restaurant
        fields = '__all__'  # সব ফিল্ড থাকবে
        read_only_fields = ['owner', 'rating']  # যদি চাস