from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardStatsView,
    UserViewSet,
    RestaurantRequestViewSet,
    RestaurantViewSet,
    OrderViewSet,
    PaymentViewSet,
    RevenueReportView,
    DeliveryAgentApprovalView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'restaurant-requests', RestaurantRequestViewSet, basename='restaurant-request')
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('revenue-report/', RevenueReportView.as_view(), name='revenue-report'),
    path('delivery-agents/approvals/', DeliveryAgentApprovalView.as_view(), name='delivery-agent-approval'),
    path('', include(router.urls)),
]
