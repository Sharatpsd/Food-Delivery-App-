from django.db.models import Count, Q

from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from users.throttling import RestaurantsThrottle
from users.permissions import IsAdminRole

from .models import DeliveryRequest, Food, Restaurant, RestaurantRequest
from .serializers import (
    DeliveryRequestSerializer,
    FoodMenuSerializer,
    FoodSerializer,
    RestaurantDetailSerializer,
    RestaurantListSerializer,
    RestaurantRequestSerializer,
    RestaurantSerializer,
)
from .services import approve_restaurant_request


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None)
        return owner == request.user


class RestaurantRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = RestaurantRequest.objects.select_related('owner').order_by("-created_at")
        if getattr(self.request.user, "role", None) == "admin":
            return queryset
        return queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'customer':
            raise PermissionDenied("Only customers can submit restaurant requests.")

        phone = self.request.data.get("phone", "").strip()
        email = self.request.data.get("email", "").strip()
        updates = []
        if phone and self.request.user.phone != phone:
            self.request.user.phone = phone
            updates.append("phone")
        if email and not self.request.user.email:
            self.request.user.email = email
            updates.append("email")
        if updates:
            self.request.user.save(update_fields=updates)

        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def approve(self, request, pk=None):
        req = self.get_object()

        if req.approved:
            return Response({"detail": "Already approved."}, status=400)

        try:
            restaurant = approve_restaurant_request(req)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=400)

        return Response({
            "detail": "Restaurant approved successfully.",
            "restaurant_id": restaurant.id,
        })


class DeliveryRequestViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = DeliveryRequest.objects.select_related('user').order_by("-created_at")
        if getattr(self.request.user, "role", None) == "admin":
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'customer':
            raise PermissionDenied("Only customers can submit delivery requests.")

        updates = []
        full_name = self.request.data.get("full_name") or self.request.data.get("name", "")
        phone = self.request.data.get("phone", "").strip()
        email = self.request.data.get("email", "").strip()
        address = self.request.data.get("address", "").strip()

        if full_name and self.request.user.name != full_name:
            self.request.user.name = full_name
            updates.append("name")
        if phone and self.request.user.phone != phone:
            self.request.user.phone = phone
            updates.append("phone")
        if email and not self.request.user.email:
            self.request.user.email = email
            updates.append("email")
        if address and self.request.user.address != address:
            self.request.user.address = address
            updates.append("address")
        if updates:
            self.request.user.save(update_fields=updates)

        serializer.save(user=self.request.user)


class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantListSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RestaurantsThrottle]

    def get_queryset(self):
        queryset = Restaurant.objects.filter(is_active=True).annotate(
            available_food_count=Count(
                'foods',
                filter=Q(foods__is_available=True),
                distinct=True,
            )
        ).filter(
            available_food_count__gt=0
        ).order_by("-created_at")

        search = self.request.query_params.get("search", "").strip()
        city = self.request.query_params.get("city", "").strip()
        theme = self.request.query_params.get("theme", "").strip()
        category = self.request.query_params.get("category", "").strip()

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(city__icontains=search) |
                Q(theme__icontains=search)
            )

        if city:
            queryset = queryset.filter(city__icontains=city)

        if theme:
            queryset = queryset.filter(theme__icontains=theme)

        if category:
            queryset = queryset.filter(foods__category__name__icontains=category)

        return queryset.distinct()


class RestaurantDetailView(generics.RetrieveAPIView):
    serializer_class = RestaurantDetailSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RestaurantsThrottle]

    def get_queryset(self):
        return Restaurant.objects.filter(is_active=True).prefetch_related('foods__category')


class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.filter(is_active=True).select_related('owner').order_by("-created_at")
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RestaurantsThrottle]


class FoodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Food.objects.select_related('restaurant', 'category').order_by("-created_at")
    serializer_class = FoodMenuSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [RestaurantsThrottle]

    def get_queryset(self):
        queryset = Food.objects.filter(is_available=True).select_related('restaurant', 'category')

        restaurant_id = self.request.query_params.get("restaurant")
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)

        return queryset.order_by("name")
