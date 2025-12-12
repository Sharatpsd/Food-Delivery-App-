from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests

from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer
from .models import User

GOOGLE_CLIENT_ID = "1006519805776-5ad2l5opvc771c0smn7vpmh0iui8u102.apps.googleusercontent.com"


# ============================
# USER REGISTER
# ============================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ============================
# GET LOGGED-IN USER
# ============================
class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ============================
# GOOGLE LOGIN API
# ============================
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:
            google_user = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )

            email = google_user["email"]
            name = google_user.get("name", "")

        except Exception:
            return Response({"error": "Invalid Google Token"}, status=400)

        # Create or Get User
        user, created = User.objects.get_or_create(
            username=email,
            defaults={"name": name, "role": "customer"}
        )

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "name": user.name,
                "role": user.role,
            }
        })
