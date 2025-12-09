from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RestaurantRequest, DeliveryRequest, Restaurant, Food
from .serializers import (
    RestaurantRequestSerializer,
    DeliveryRequestSerializer,
    RestaurantSerializer,
    FoodSerializer,
)
from rest_framework import serializers as drf_serializers


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None)
        return owner == request.user


# -----------------------------
# Restaurant Join Request API
# -----------------------------
class RestaurantRequestViewSet(viewsets.ModelViewSet):
    queryset = RestaurantRequest.objects.all().order_by("-created_at")
    serializer_class = RestaurantRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        req = self.get_object()
        if req.approved:
            return Response({"detail": "Already approved."}, status=400)

        req.approved = True
        req.save()

        Restaurant.objects.create(
            owner=req.owner,
            name=req.name,
            logo=req.logo,
            address=req.address,
            city=req.city,
            theme=req.theme,
        )

        return Response({"detail": "Restaurant approved & created."})


# -----------------------------
# Delivery Partner Request API
# -----------------------------
class DeliveryRequestViewSet(viewsets.ModelViewSet):
    queryset = DeliveryRequest.objects.all().order_by("-created_at")
    serializer_class = DeliveryRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -----------------------------
# Public Restaurants API
# -----------------------------
class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]


# -----------------------------
# Owner Can Add Foods
# -----------------------------
class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all().order_by("-created_at")
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        restaurant_id = self.request.data.get("restaurant")
        restaurant = Restaurant.objects.get(pk=restaurant_id)

        if restaurant.owner != self.request.user:
            raise permissions.PermissionDenied("You do not own this restaurant.")

        serializer.save()
