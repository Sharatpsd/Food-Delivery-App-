from rest_framework import generics, permissions
from .models import Food
from .serializers import FoodSerializer
from restaurants.models import Restaurant

class FoodListView(generics.ListAPIView):
    serializer_class = FoodSerializer

    def get_queryset(self):
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            return Food.objects.filter(restaurant_id=restaurant_id)
        return Food.objects.all()

class FoodCreateView(generics.CreateAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.get(owner=self.request.user)
        serializer.save(restaurant=restaurant)