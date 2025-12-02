from django.db import models
from django.conf import settings

class Restaurant(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="restaurants"
    )

    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="restaurant_logos/", blank=True)
    address = models.TextField()
    rating = models.FloatField(default=0.0)

    # 🔥 New fields
    avg_cost = models.CharField(max_length=100, blank=True)
    theme = models.CharField(max_length=255, blank=True)
    must_try = models.CharField(max_length=255, blank=True)
    timings = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    social = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name
