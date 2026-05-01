from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User


class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "name", "role"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'role', 'phone', 'address']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'name', 'role', 'phone', 'address']

    def validate_email(self, value):
        email = User.objects.normalize_email(value).strip()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists. Please log in instead."
            )

        if User.objects.filter(username__iexact=email, email="").exists():
            raise serializers.ValidationError(
                "An account with this email already exists. Please log in instead."
            )

        return email

    def validate_role(self, value):
        if not value:
            return "customer"

        if value not in ['customer', 'delivery']:
            raise serializers.ValidationError(
                "You can register only as a customer or delivery partner."
            )

        return value

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if password != password2:
            raise serializers.ValidationError(
                {"password2": "Password confirmation does not match."}
            )

        user = User(
            username=attrs.get("username"),
            email=attrs.get("email"),
            name=attrs.get("name", ""),
            role=attrs.get("role", "customer"),
            phone=attrs.get("phone", ""),
            address=attrs.get("address", ""),
        )

        try:
            validate_password(password, user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop("password2", None)

        role = validated_data.get('role', 'customer')
        if not role:
            role = 'customer'
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            role=role,
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )
        return user


class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        token = attrs["token"]
        google_client_ids = self._get_google_client_ids()
        google_user = self._verify_google_token(token, google_client_ids)

        email = google_user.get("email")
        name = google_user.get("name", "")
        email_verified = google_user.get("email_verified", False)

        if not email:
            raise serializers.ValidationError({"token": "Google account email missing."})

        if not email_verified:
            raise serializers.ValidationError({"token": "Google email is not verified."})

        attrs["email"] = User.objects.normalize_email(email).strip()
        attrs["name"] = name
        return attrs

    def save(self, **kwargs):
        return self._resolve_google_user(
            email=self.validated_data["email"],
            name=self.validated_data["name"],
        )

    def _get_google_client_ids(self):
        google_client_ids = getattr(settings, "GOOGLE_CLIENT_IDS", None) or []
        if not google_client_ids:
            single_client = getattr(settings, "GOOGLE_CLIENT_ID", None)
            if single_client:
                google_client_ids = [single_client]

        if not google_client_ids:
            raise serializers.ValidationError({"token": "Google login is not configured."})

        return google_client_ids

    def _verify_google_token(self, token, google_client_ids):
        verify_error = None

        for client_id in google_client_ids:
            try:
                return id_token.verify_oauth2_token(
                    token,
                    requests.Request(),
                    client_id,
                )
            except Exception as exc:
                verify_error = exc

        if settings.DEBUG and verify_error:
            raise serializers.ValidationError(
                {"token": f"Invalid Google token: {verify_error}"}
            )

        raise serializers.ValidationError({"token": "Invalid Google token."})

    def _resolve_google_user(self, email, name):
        user = User.objects.filter(email__iexact=email).first()
        if user:
            update_fields = []
            if not user.name and name:
                user.name = name
                update_fields.append("name")
            if update_fields:
                user.save(update_fields=update_fields)
            return user

        legacy_user = User.objects.filter(username__iexact=email).first()
        if legacy_user:
            if legacy_user.email and legacy_user.email.lower() != email.lower():
                raise serializers.ValidationError(
                    {"token": "An account conflict exists for this email."}
                )

            update_fields = []
            if legacy_user.email != email:
                legacy_user.email = email
                update_fields.append("email")
            if not legacy_user.name and name:
                legacy_user.name = name
                update_fields.append("name")
            if update_fields:
                legacy_user.save(update_fields=update_fields)
            return legacy_user

        return User.objects.create_google_user(
            email=email,
            name=name,
            role="customer",
        )


class TokenObtainPairWithUserSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = AuthUserSerializer(self.user).data
        return data
