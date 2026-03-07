from django.urls import path
from .views import (
    InitiatePaymentView,
    CompletePaymentView,
    PaymentStatusView,
    SSLCommerzSuccessCallbackView,
    SSLCommerzFailCallbackView,
    SSLCommerzCancelCallbackView,
    SSLCommerzIPNView,
)

urlpatterns = [
    path("initiate/", InitiatePaymentView.as_view()),
    path("complete/", CompletePaymentView.as_view()),
    path("status/<int:order_id>/", PaymentStatusView.as_view()),
    path("callback/success/", SSLCommerzSuccessCallbackView.as_view()),
    path("callback/fail/", SSLCommerzFailCallbackView.as_view()),
    path("callback/cancel/", SSLCommerzCancelCallbackView.as_view()),
    path("callback/ipn/", SSLCommerzIPNView.as_view()),
]
