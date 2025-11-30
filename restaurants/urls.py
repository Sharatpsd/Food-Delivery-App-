from django.urls import path
from .views import RestaurantListView, RestaurantDetailView, RestaurantCreateView

urlpatterns = [
    path('', RestaurantListView.as_view()),
    path('<int:pk>/', RestaurantDetailView.as_view()),
    path('create/', RestaurantCreateView.as_view()),
]