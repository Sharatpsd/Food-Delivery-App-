from django.urls import path
from .views import (
    OrderCreateView,
    CustomerOrderListView,
    RestaurantOrderListView,
    UpdateOrderStatusView,
    CancelOrderView,
    AssignDeliveryBoyView,
    DeliveryCompleteView
)

urlpatterns = [
    path("create/", OrderCreateView.as_view()),
    path("my-orders/", CustomerOrderListView.as_view()),
    path("restaurant-orders/", RestaurantOrderListView.as_view()),
    path("<int:pk>/update-status/", UpdateOrderStatusView.as_view()),
    path("<int:pk>/cancel/", CancelOrderView.as_view()),
    path("<int:pk>/assign-delivery/", AssignDeliveryBoyView.as_view()),
    path("<int:pk>/delivered/", DeliveryCompleteView.as_view()),
]
