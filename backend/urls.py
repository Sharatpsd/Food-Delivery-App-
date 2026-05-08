from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

from users.views import TokenObtainPairThrottledView, TokenRefreshThrottledView


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
        TokenRefreshThrottledView.as_view(),
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
if getattr(settings, "SERVE_LOCAL_MEDIA", False):
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
