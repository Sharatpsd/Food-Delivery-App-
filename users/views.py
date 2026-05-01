"""
Authentication design for the users app:
- register returns JWT tokens plus a minimal user payload
- password login returns JWT tokens plus the same user payload
- Google login validates the Google token, resolves the user by email, and
  returns the same standardized auth response
- token refresh is throttled through a dedicated refresh view
"""

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import (
    AuthUserSerializer,
    GoogleLoginSerializer,
    RegisterSerializer,
    TokenObtainPairWithUserSerializer,
    UserSerializer,
)
from .throttling import RegisterThrottle, LoginThrottle, TokenRefreshThrottle


def build_auth_response(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": AuthUserSerializer(user).data,
    }

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisterThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            build_auth_response(user),
            status=status.HTTP_201_CREATED,
        )

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class TokenObtainPairThrottledView(TokenObtainPairView):
    serializer_class = TokenObtainPairWithUserSerializer
    throttle_classes = [LoginThrottle]


class TokenRefreshThrottledView(TokenRefreshView):
    throttle_classes = [TokenRefreshThrottle]

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(build_auth_response(user))
