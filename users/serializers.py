from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'role', 'phone', 'address']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'name', 'role', 'phone', 'address']

    def validate_role(self, value):
        if value in ['admin', 'restaurant']:
            raise serializers.ValidationError("Invalid role. Only 'customer' and 'delivery' are allowed during registration.")
        if value not in ['customer', 'delivery', '']:
            raise serializers.ValidationError("Role must be either 'customer' or 'delivery'.")
        return value

    def create(self, validated_data):
        role = validated_data.get('role', 'customer')
        if not role or role not in ['customer', 'delivery']:
            role = 'customer'
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            role=role,
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )
        return user
