from django.urls import path
from .views import (
    RestaurantListView,
    RestaurantDetailView,
    RestaurantCreateView,
    MyRestaurantView
)

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant-list'),
    path('<int:id>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('create/', RestaurantCreateView.as_view(), name='restaurant-create'),
    
   
    path('my/', MyRestaurantView.as_view(), name='my-restaurant'),
]