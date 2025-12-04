from django.urls import path
from .views import (
    AssignedOrdersListView,
    PendingAssignedOrdersView,
    AcceptOrderView,
    StartDeliveryView,
    CompleteDeliveryView,
    DeliveryDashboardView
)

urlpatterns = [
    path("assigned/", AssignedOrdersListView.as_view(), name="delivery-assigned"),
    path("assigned/pending/", PendingAssignedOrdersView.as_view(), name="delivery-assigned-pending"),
    path("<int:pk>/accept/", AcceptOrderView.as_view(), name="delivery-accept"),
    path("<int:pk>/start/", StartDeliveryView.as_view(), name="delivery-start"),
    path("<int:pk>/complete/", CompleteDeliveryView.as_view(), name="delivery-complete"),
    path("dashboard/", DeliveryDashboardView.as_view(), name="delivery-dashboard"),
]
