from django.db import models
from restaurants.models import Restaurant

class Food(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='foods')
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title