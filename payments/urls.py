from django.urls import path
from .views import InitiatePaymentView, CompletePaymentView

urlpatterns = [
    path('initiate/', InitiatePaymentView.as_view()),
    path('complete/', CompletePaymentView.as_view()),
]