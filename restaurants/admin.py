from django.contrib import admin
from .models import RestaurantRequest, DeliveryRequest, Restaurant, Food, Category


def get_matching_restaurant(name, city):
    queryset = Restaurant.objects.filter(name__iexact=name.strip())
    if city.strip():
        queryset = queryset.filter(city__iexact=city.strip())
    return queryset.order_by("id").first()


@admin.register(RestaurantRequest)
class RestaurantRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "city", "approved", "created_at")
    actions = ["approve_requests"]

    def approve_requests(self, request, queryset):
        for req in queryset:
            if not req.approved:
                req.approved = True
                req.save()
                restaurant = get_matching_restaurant(req.name, req.city)
                if restaurant:
                    restaurant.owner = restaurant.owner or req.owner
                    restaurant.address = restaurant.address or req.address
                    restaurant.city = restaurant.city or req.city
                    restaurant.theme = restaurant.theme or req.theme
                    if req.logo and not restaurant.logo:
                        restaurant.logo = req.logo
                    restaurant.is_active = True
                    restaurant.save()
                else:
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


# ⭐ ADD THIS PART
@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ("name", "restaurant", "price", "is_available")
    list_filter = ("restaurant", "is_available")
    search_fields = ("name",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
