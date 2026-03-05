from pathlib import Path
from datetime import timedelta
from decouple import config
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent


# ================================================================
# SECURITY
# ================================================================
SECRET_KEY = config("SECRET_KEY", default="test-secret")

DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "food-delivery-app-1-ihcm.onrender.com",
    ".onrender.com",
]


# CSRF trusted origins (VERY IMPORTANT)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://food-delivery-frontend-mktt.onrender.com",
    "https://food-delivery-app-1-ihcm.onrender.com",
]


# ================================================================
# INSTALLED APPS
# ================================================================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # third party
    "corsheaders",
    "rest_framework",

    # project apps
    "users",
    "restaurants",
    "orders",
    "payments",
    "delivery",
]


# ================================================================
# MIDDLEWARE
# ================================================================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "backend.urls"


# ================================================================
# TEMPLATES
# ================================================================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "backend.wsgi.application"


# ================================================================
# DATABASE
# ================================================================
DATABASE_URL = config("DATABASE_URL", default=None)

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ================================================================
# AUTH
# ================================================================
AUTH_USER_MODEL = "users.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
]


# ================================================================
# INTERNATIONALIZATION
# ================================================================
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True
USE_TZ = True


# ================================================================
# STATIC FILES
# ================================================================
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# ================================================================
# MEDIA FILES
# ================================================================
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# ================================================================
# CORS SETTINGS
# ================================================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://food-delivery-frontend-mktt.onrender.com",
]

CORS_ALLOW_CREDENTIALS = True


# ================================================================
# DJANGO REST FRAMEWORK
# ================================================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}


# ================================================================
# JWT
# ================================================================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"