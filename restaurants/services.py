from django.db import transaction

from .models import Restaurant


def get_matching_restaurant(name, city):
    queryset = Restaurant.objects.filter(name__iexact=name.strip())
    if city.strip():
        queryset = queryset.filter(city__iexact=city.strip())
    return queryset.order_by("id").first()


@transaction.atomic
def approve_restaurant_request(request_obj):
    if not request_obj.owner:
        raise ValueError("Owner not found")

    restaurant = get_matching_restaurant(request_obj.name, request_obj.city)
    if restaurant:
        restaurant.owner = restaurant.owner or request_obj.owner
        restaurant.address = restaurant.address or request_obj.address
        restaurant.city = restaurant.city or request_obj.city
        restaurant.theme = restaurant.theme or request_obj.theme
        if request_obj.logo and not restaurant.logo:
            restaurant.logo = request_obj.logo
        restaurant.is_active = True
        restaurant.save()
    else:
        restaurant = Restaurant.objects.create(
            owner=request_obj.owner,
            name=request_obj.name,
            logo=request_obj.logo,
            address=request_obj.address,
            city=request_obj.city,
            theme=request_obj.theme,
            is_active=True,
        )

    owner = request_obj.owner
    owner_updates = []
    if owner.role != "restaurant":
        owner.role = "restaurant"
        owner_updates.append("role")
    if owner_updates:
        owner.save(update_fields=owner_updates)

    if not request_obj.approved:
        request_obj.approved = True
        request_obj.save(update_fields=["approved"])

    return restaurant
