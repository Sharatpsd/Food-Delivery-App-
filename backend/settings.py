from pathlib import Path
from datetime import timedelta
from decouple import config
import os
import dj_database_url
import cloudinary

BASE_DIR = Path(__file__).resolve().parent.parent


def _to_bool(value, default=False):
    if isinstance(value, bool):
        return value
    if value is None:
        return default

    text = str(value).strip().lower()

    if text in {"1", "true", "t", "yes", "y", "on", "debug"}:
        return True

    if text in {"0", "false", "f", "no", "n", "off", "prod", "production", "release"}:
        return False

    return default


# ================================================================
# SECURITY
# ================================================================

SECRET_KEY = config("SECRET_KEY", default="test-secret")

DEBUG = _to_bool(config("DEBUG", default="False"), default=False)

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "food-delivery-app-1-ihcm.onrender.com",
    ".onrender.com",
]


# ================================================================
# GOOGLE AUTH
# ================================================================

GOOGLE_CLIENT_ID = config(
    "GOOGLE_CLIENT_ID",
    default="1006519805776-5ad2l5opvc771c0smn7vpmh0iui8u102.apps.googleusercontent.com",
)

GOOGLE_CLIENT_IDS = [
    cid.strip()
    for cid in config(
        "GOOGLE_CLIENT_IDS",
        default=f"{GOOGLE_CLIENT_ID},374279373492-apflc0pvsma478fiua7tkqgm54ir7r4a.apps.googleusercontent.com",
    ).split(",")
    if cid.strip()
]


# ================================================================
# CSRF
# ================================================================

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
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
    "cloudinary",
    "cloudinary_storage",

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
# MEDIA (Cloudinary)
# ================================================================

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

MEDIA_URL = "/media/"

# ================================================================
# CLOUDINARY CONFIG
# ================================================================

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": config("CLOUDINARY_API_KEY"),
    "API_SECRET": config("CLOUDINARY_API_SECRET"),
}

cloudinary.config(
    cloud_name=config("CLOUDINARY_CLOUD_NAME"),
    api_key=config("CLOUDINARY_API_KEY"),
    api_secret=config("CLOUDINARY_API_SECRET"),
)

# ================================================================
# CORS
# ================================================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://food-delivery-frontend-mktt.onrender.com",
]

CORS_ALLOW_CREDENTIALS = True

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True


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


# ================================================================
# PRODUCTION SECURITY
# ================================================================

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ================================================================
# PAYMENT (SSLCOMMERZ)
# ================================================================

FRONTEND_BASE_URL = config("FRONTEND_BASE_URL", default="http://localhost:5173")

SSLCOMMERZ_STORE_ID = config("SSLCOMMERZ_STORE_ID", default="")
SSLCOMMERZ_STORE_PASSWORD = config("SSLCOMMERZ_STORE_PASSWORD", default="")

SSLCOMMERZ_IS_SANDBOX = config("SSLCOMMERZ_IS_SANDBOX", cast=bool, default=True)