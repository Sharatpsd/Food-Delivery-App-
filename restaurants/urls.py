from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DeliveryRequestViewSet,
    FoodViewSet,
    RestaurantDetailView,
    RestaurantListView,
    RestaurantRequestViewSet,
    RestaurantViewSet,
)


router = DefaultRouter()
router.register("restaurant-requests", RestaurantRequestViewSet)
router.register("delivery-requests", DeliveryRequestViewSet)
router.register("restaurants", RestaurantViewSet)
router.register("foods", FoodViewSet)


urlpatterns = [
    path("", RestaurantListView.as_view(), name="restaurant-list"),
    path("<int:pk>/", RestaurantDetailView.as_view(), name="restaurant-detail"),
    path("", include(router.urls)),
]
