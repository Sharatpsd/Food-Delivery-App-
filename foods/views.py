from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Food
from .serializers import FoodSerializer
from users.permissions import IsRestaurantOwner

class FoodListView(generics.ListAPIView):
    queryset = Food.objects.filter(is_available=True)
    serializer_class = FoodSerializer
    permission_classes = [permissions.AllowAny]


class FoodCreateView(generics.CreateAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def perform_create(self, serializer):
        # Attach current user's restaurant (assumes one restaurant per owner)
        restaurant = getattr(self.request.user, "restaurants", None)
        if restaurant is None:
            # no restaurants related manager? fallback
            raise ValueError("No restaurant relation found for user.")
        restaurant_instance = restaurant.first()
        if not restaurant_instance:
            return Response({"detail": "Create a restaurant first."}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(restaurant=restaurant_instance)
