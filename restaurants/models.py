from django.db import models
from django.conf import settings


# ============================
# Restaurant Join Request
# ============================
class RestaurantRequest(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="restaurant_requests")
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to="restaurant_requests/logos/", blank=True, null=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    avg_cost = models.CharField(max_length=100, blank=True)
    theme = models.CharField(max_length=100, blank=True)
    must_try = models.CharField(max_length=200, blank=True)
    timings = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    social = models.CharField(max_length=300, blank=True)
    note = models.TextField(blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner})"


# ============================
# Delivery Partner Request
# ============================
class DeliveryRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="delivery_requests")
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50)
    city = models.CharField(max_length=100, blank=True)
    id_document = models.FileField(upload_to="delivery_requests/docs/", blank=True, null=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.user})"


# ============================
# Restaurant Model
# ============================
class Restaurant(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="restaurants")
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to="restaurants/logos/", blank=True, null=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    theme = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ============================
# Food Model
# ============================
class Food(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="foods")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to="foods/images/", blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.restaurant.name})"
