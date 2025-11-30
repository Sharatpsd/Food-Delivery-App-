from django.urls import path
from .views import FoodListView, FoodCreateView

urlpatterns = [
    path('', FoodListView.as_view()),
    path('create/', FoodCreateView.as_view()),
]