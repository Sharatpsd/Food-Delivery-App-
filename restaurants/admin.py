from django.contrib import admin
from .models import Restaurant


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'rating', 'address']
    search_fields = ['name', 'owner__username', 'owner__name']
    readonly_fields = ['rating']  
    list_filter = ['rating']