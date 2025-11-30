from django.contrib import admin
from .models import Food


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ['title', 'restaurant', 'price', 'is_available']
    list_filter = ['is_available', 'restaurant']
    search_fields = ['title', 'restaurant__name']
    list_editable = ['is_available', 'price']