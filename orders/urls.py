from django.urls import path
from .views import (
    OrderCreateView, CustomerOrderListView,
    RestaurantOrderListView, UpdateOrderStatusView
)

urlpatterns = [
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('my-orders/', CustomerOrderListView.as_view(), name='customer-orders'),
    path('restaurant-orders/', RestaurantOrderListView.as_view(), name='restaurant-orders'),
    path('<int:pk>/update-status/', UpdateOrderStatusView.as_view(), name='update-status'),
]