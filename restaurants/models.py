from django.db import models
from django.conf import settings


# ============================
# Category
# ============================
class Category(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


# ============================
# Restaurant Join Request
# ============================
class RestaurantRequest(models.Model):

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)

    logo = models.ImageField(
        upload_to="restaurant_requests/logos/",
        blank=True,
        null=True
    )

    address = models.TextField(blank=True)

    city = models.CharField(max_length=150, blank=True)

    avg_cost = models.CharField(max_length=150, blank=True)

    theme = models.CharField(max_length=150, blank=True)

    must_try = models.CharField(max_length=255, blank=True)

    timings = models.CharField(max_length=255, blank=True)

    website = models.URLField(blank=True)

    social = models.CharField(max_length=500, blank=True)

    note = models.TextField(blank=True)

    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ============================
# Delivery Partner Request
# ============================
class DeliveryRequest(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="delivery_requests"
    )

    full_name = models.CharField(max_length=255)

    phone = models.CharField(max_length=50)

    city = models.CharField(max_length=150, blank=True)

    id_document = models.FileField(
        upload_to="delivery_requests/docs/",
        blank=True,
        null=True
    )

    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


# ============================
# Restaurant
# ============================
class Restaurant(models.Model):

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)

    logo = models.ImageField(
        upload_to="restaurants/logos/",
        blank=True,
        null=True
    )

    logo_url = models.URLField(blank=True, null=True)

    address = models.TextField(blank=True)

    city = models.CharField(max_length=150, blank=True)

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0
    )

    theme = models.CharField(max_length=150, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def get_logo(self):
        if self.logo:
            return self.logo.url
        if self.logo_url:
            return self.logo_url
        return None

    def __str__(self):
        return self.name


# ============================
# Food
# ============================
class Food(models.Model):

    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="foods"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="foods"
    )

    name = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to="foods/images/",
        blank=True,
        null=True
    )

    image_url = models.URLField(blank=True, null=True)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def get_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return None

    def __str__(self):
        return self.name