from django.urls import path
from .views import (
    RestaurantListView,
    RestaurantDetailView,
    RestaurantCreateView,
    MyRestaurantView,
    RestaurantDashboardView
)

urlpatterns = [
    path("", RestaurantListView.as_view(), name="restaurant-list"),
    path("<int:id>/", RestaurantDetailView.as_view(), name="restaurant-detail"),
    path("create/", RestaurantCreateView.as_view(), name="restaurant-create"),
    path("my/", MyRestaurantView.as_view(), name="my-restaurant"),
    path("dashboard/", RestaurantDashboardView.as_view(), name="restaurant-dashboard"),
]
