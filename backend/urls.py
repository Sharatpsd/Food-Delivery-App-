from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView
from users.views import TokenObtainPairThrottledView


def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "Bite Backend is running",
    })

urlpatterns = [
    path("", health_check, name="health_check"),

    # =========================
    # ADMIN
    # =========================
    path("admin/", admin.site.urls),

    # =========================
    # AUTHENTICATION
    # =========================
    path(
        "api/auth/token/",
        TokenObtainPairThrottledView.as_view(),
        name="token_obtain_pair"
    ),

    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    path(
        "api/auth/",
        include("users.urls")
    ),

    # =========================
    # APPLICATION APIS
    # =========================
    path(
        "api/restaurants/",
        include("restaurants.urls")
    ),

    path(
        "api/orders/",
        include("orders.urls")
    ),

    path(
        "api/payments/",
        include("payments.urls")
    ),

    path(
        "api/delivery/",
        include("delivery.urls")
    ),
]


# ======================================================
# MEDIA FILE SUPPORT (for ImageField / FileField)
# ======================================================
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
