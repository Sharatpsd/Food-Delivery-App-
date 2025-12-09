from django.contrib import admin
from .models import RestaurantRequest, DeliveryRequest, Restaurant, Food


@admin.register(RestaurantRequest)
class RestaurantRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "city", "approved", "created_at")
    actions = ["approve_requests"]

    def approve_requests(self, request, queryset):
        for req in queryset:
            if not req.approved:
                req.approved = True
                req.save()
                Restaurant.objects.create(
                    owner=req.owner,
                    name=req.name,
                    logo=req.logo,
                    address=req.address,
                    city=req.city,
                    theme=req.theme,
                    is_active=True,
                )
        self.message_user(request, "Requests approved & restaurants created.")


@admin.register(DeliveryRequest)
class DeliveryRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "user", "city", "approved", "created_at")
    actions = ["approve_delivery"]

    def approve_delivery(self, request, queryset):
        queryset.update(approved=True)
        self.message_user(request, "Delivery partners approved.")


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "city", "rating", "is_active", "created_at")


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ("name", "restaurant", "price", "is_available", "created_at")
    list_filter = ("restaurant", "is_available")
    search_fields = ("name", "restaurant__name")
