# restaurants/views.py

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q
from datetime import date

from .models import Restaurant
from foods.models import Food
from orders.models import Order
from .serializers import RestaurantSerializer
from users.permissions import IsRestaurantOwner


# -------------------------------------------
# LIST + SEARCH RESTAURANTS (CUSTOMER)
# -------------------------------------------
class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        qs = Restaurant.objects.all()
        search = self.request.query_params.get("search")

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(city__icontains=search) |
                Q(theme__icontains=search) |
                Q(must_try__icontains=search)
            )

        return qs


# -------------------------------------------
# SINGLE RESTAURANT DETAIL
# -------------------------------------------
class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    lookup_field = "id"


# -------------------------------------------
# CREATE RESTAURANT
# -------------------------------------------
class RestaurantCreateView(generics.CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# -------------------------------------------
# MY RESTAURANT (OWNER)
# -------------------------------------------
class MyRestaurantView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        restaurant = Restaurant.objects.filter(owner=request.user).first()

        if not restaurant:
            return Response({"detail": "No restaurant found!"}, status=404)

        return Response(RestaurantSerializer(restaurant).data)


# -------------------------------------------
# RESTAURANT DASHBOARD (OWNER)
# -------------------------------------------
class RestaurantDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        restaurant = request.user.restaurants.first()

        if not restaurant:
            return Response({"detail": "Restaurant not found!"}, status=404)

        orders = Order.objects.filter(restaurant=restaurant)
        today = date.today()

        stats = {
            "total": orders.count(),
            "pending": orders.filter(status="pending").count(),
            "accepted": orders.filter(status="accepted").count(),
            "cooking": orders.filter(status="cooking").count(),
            "on_the_way": orders.filter(status="on_the_way").count(),
            "delivered": orders.filter(status="delivered").count(),
            "cancelled": orders.filter(status="cancelled").count(),
        }

        revenue = {
            "total": orders.filter(status="delivered").aggregate(total=Sum("total"))["total"] or 0,
            "today": orders.filter(status="delivered", created_at__date=today).aggregate(total=Sum("total"))["total"] or 0,
            "monthly": orders.filter(status="delivered", created_at__month=today.month).aggregate(total=Sum("total"))["total"] or 0,
        }

        popular_foods = Food.objects.filter(restaurant=restaurant).annotate(
            total_sold=Sum("order_items__quantity")
        ).order_by("-total_sold")[:5]

        popular_food_list = [
            {
                "id": f.id,
                "title": f.title,
                "total_sold": f.total_sold or 0,
                "price": f.price,
                "image": f.image.url if f.image else None,
            }
            for f in popular_foods
        ]

        recent_orders = orders.order_by("-created_at")[:5]
        recent_order_list = [
            {
                "id": o.id,
                "customer": o.customer.name,
                "total": o.total,
                "status": o.status,
                "created_at": o.created_at,
            }
            for o in recent_orders
        ]

        return Response({
            "stats": stats,
            "revenue": revenue,
            "popular_foods": popular_food_list,
            "recent_orders": recent_order_list,
        })
