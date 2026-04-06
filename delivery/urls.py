from django.urls import path
from .views import AssignedOrdersListView, CompleteDeliveryView

urlpatterns = [
    path('assigned-orders/', AssignedOrdersListView.as_view()),
    path('complete-delivery/<int:id>/', CompleteDeliveryView.as_view()),
]