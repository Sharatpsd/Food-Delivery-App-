from django.db import models
from users.models import User

class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='restaurant_logos/', blank=True)
    address = models.TextField()
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.name
        