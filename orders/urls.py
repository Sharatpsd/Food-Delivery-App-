from django.urls import path

from .views import (
    AssignDeliveryBoyView,
    CancelOrderView,
    CartAddView,
    CartItemDetailView,
    CartSummaryView,
    CustomerOrderListView,
    DeliveryCompleteView,
    OrderCreateView,
    RestaurantOrderListView,
    UpdateOrderStatusView,
)


urlpatterns = [
    path("", OrderCreateView.as_view(), name="order-create"),
    path("create/", OrderCreateView.as_view(), name="order-create-legacy"),
    path("cart/", CartSummaryView.as_view(), name="cart-summary"),
    path("cart/add/", CartAddView.as_view(), name="cart-add"),
    path("cart/items/<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("my-orders/", CustomerOrderListView.as_view(), name="customer-orders"),
    path("restaurant-orders/", RestaurantOrderListView.as_view(), name="restaurant-orders"),
    path("<int:pk>/update-status/", UpdateOrderStatusView.as_view(), name="order-status-update"),
    path("<int:pk>/cancel/", CancelOrderView.as_view(), name="order-cancel"),
    path("<int:pk>/assign-delivery/", AssignDeliveryBoyView.as_view(), name="assign-delivery"),
    path("<int:pk>/delivered/", DeliveryCompleteView.as_view(), name="delivery-complete"),
]
