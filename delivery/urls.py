from django.urls import path
from .views import DeliveryBoyOrdersView, DeliverOrderView

urlpatterns = [
    path('my-orders/', DeliveryBoyOrdersView.as_view()),
    path('deliver/<int:pk>/', DeliverOrderView.as_view()),
]