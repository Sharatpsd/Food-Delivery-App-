from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Restaurant
from .serializers import RestaurantSerializer
from users.permissions import IsRestaurantOwner 

class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class RestaurantCreateView(generics.CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MyRestaurantView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return Response(
                {"detail": "No restaurant found. Create one first."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)
