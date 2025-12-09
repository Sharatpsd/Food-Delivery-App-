from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantRequestViewSet,
    DeliveryRequestViewSet,
    RestaurantViewSet,
    FoodViewSet,
)

router = DefaultRouter()
router.register("restaurant-requests", RestaurantRequestViewSet)
router.register("delivery-requests", DeliveryRequestViewSet)
router.register("restaurants", RestaurantViewSet)
router.register("foods", FoodViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
