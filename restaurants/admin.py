from django.contrib import admin
from .models import Restaurant

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "rating", "city", "address"]
    search_fields = ["name", "owner__username", "city"]
    list_filter = ["city", "rating"]

    # Admin form fields group (optional but beautiful)
    fieldsets = (
        ("Basic Info", {
            "fields": ("owner", "name", "logo", "address", "city", "rating")
        }),
        ("Extra Information", {
            "fields": ("avg_cost", "theme", "must_try", "timings", "website", "social")
        }),
    )
