from django.urls import path
from .views import RegisterView, UserView, GoogleLoginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("user/", UserView.as_view(), name="user"),
    path("google/", GoogleLoginView.as_view(), name="google-login"),  # NEW
]
