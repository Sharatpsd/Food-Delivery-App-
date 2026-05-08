from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from restaurants.models import Category, Food, Restaurant


MENU_TEMPLATES = {
    "Kacchi Bhai": [
        ("Kacchi Bhai Special", "Signature kacchi biryani with tender mutton and potato.", "Kacchi", "399.00", "/media/foods/images/Kacchi_Bhai.jpg"),
        ("Borhani", "Chilled borhani with mint and spice.", "Drinks", "80.00", "/media/foods/images/images_3.jpg"),
        ("Mutton Rezala", "Creamy rezala with aromatic spices.", "Kacchi", "349.00", "/media/foods/images/rezala-1.jpg"),
    ],
    "Gloria Jean's Coffees": [
        ("Cappuccino", "Freshly brewed cappuccino with smooth foam.", "Drinks", "220.00", "/media/foods/images/images_1.jpg"),
        ("Cafe Latte", "Espresso balanced with warm milk.", "Drinks", "240.00", "/media/foods/images/images_2.jpg"),
        ("Chocolate Muffin", "Soft chocolate muffin for coffee time.", "Dessert", "160.00", "/media/foods/images/9461247.jpg"),
    ],
    "Chef's Table": [
        ("Chef's Fried Rice", "House-style fried rice with chicken and vegetables.", "Chinese", "320.00", "/media/foods/images/Panshi_Chicken_Fried_Rice.jpg"),
        ("Creamy Chicken Pasta", "Creamy pasta with herbs and grilled chicken.", "Pizza", "360.00", "/media/foods/images/Black-Truffle-Pasta3.jpg"),
        ("Garlic Chicken Steak", "Pan-seared chicken steak with garlic butter.", "BBQ", "410.00", "/media/foods/images/world-cuisine-with-delicious-food.jpg"),
    ],
    "Panshi Restaurant": [
        ("Panshi Chicken Fried Rice", "Popular fried rice with chicken and vegetables.", "Chinese", "280.00", "/media/foods/images/Panshi_Chicken_Fried_Rice.jpg"),
        ("Hakka Noodles", "Wok-tossed noodles with chicken and capsicum.", "Chinese", "260.00", "/media/foods/images/images.jpg"),
        ("Chicken Chilli", "Spicy chicken chilli served hot.", "Chinese", "300.00", "/media/foods/images/Chili-Chicken-Recipe.webp"),
    ],
    "Handi": [
        ("Handi Chicken Biryani", "Aromatic handi biryani slow-cooked in spice.", "Kacchi", "350.00", "/media/foods/images/handi-dum-biryani-in-a-traditional-clay-pot.jpg"),
        ("Chicken Handi", "Traditional chicken handi with rich gravy.", "Kacchi", "330.00", "/media/foods/images/Chicken_Handi.jpg"),
        ("Mutton Korma", "Rich korma with soft mutton pieces.", "Kacchi", "380.00", "/media/foods/images/Mutton_Korma.jpg"),
    ],
    "Cafe Rio": [
        ("Chicken Club Sandwich", "Grilled chicken club sandwich with fries.", "Burger", "290.00", "/media/foods/images/60f2ea67b471327a1d82959b_chicken-roll_1500-x-1200-1.webp"),
        ("Cafe Rio Pasta", "Creamy chicken pasta bowl.", "Pizza", "340.00", "/media/foods/images/Black-Truffle-Pasta3.jpg"),
        ("Cold Coffee", "Iced coffee with chocolate drizzle.", "Drinks", "190.00", "/media/foods/images/images_2.jpg"),
    ],
    "The Manhattan Fish Market": [
        ("Fish & Chips", "Crispy fish fillet with golden fries.", "BBQ", "420.00", "/media/foods/images/high-angle-pakistan-dish-assortment.jpg"),
        ("Grilled Dory Fillet", "Herb grilled dory with butter rice.", "BBQ", "470.00", "/media/foods/images/world-cuisine-with-delicious-food.jpg"),
        ("Tempura Prawns", "Crunchy prawns served with dipping sauce.", "BBQ", "390.00", "/media/foods/images/Tempura_Prawns.jpg"),
    ],
    "Spicy Ramna": [
        ("Morog Polao", "Traditional morog polao with fragrant rice.", "biriyani", "340.00", "/media/foods/images/images_8nqYlgW.jpg"),
        ("Beef Bhuna Khichuri", "Spicy bhuna khichuri with tender beef.", "biriyani", "320.00", "/media/foods/images/high-angle-pakistan-dish-assortment.jpg"),
        ("Spicy Chicken Roast", "Roasted chicken with bold masala.", "biriyani", "280.00", "/media/foods/images/world-cuisine-with-delicious-food.jpg"),
    ],
    "Cheez": [
        ("Cheez Loaded Pizza", "Cheesy loaded pizza baked fresh.", "Pizza", "540.00", "/media/foods/images/cheese-loaded-pizza-photo.jpeg"),
        ("Pepperoni Pizza", "Pepperoni pizza with extra cheese.", "Pizza", "590.00", "/media/foods/images/Pepperoni-pizza.jpg"),
        ("Garlic Breadsticks", "Fresh-baked garlic breadsticks.", "Pizza", "180.00", "/media/foods/images/garlic-breadsticks-4150711-hero-01-a1fd1f54ab6a425aa95196cae3a0b2c0.jpg"),
    ],
    "BBQ Bangladesh": [
        ("BBQ Full Chicken", "Whole grilled chicken with smoky marinade.", "BBQ", "699.00", "/media/foods/images/baked-turkey-with-lettuce-pan.jpg"),
        ("BBQ Lamb Chops", "Juicy lamb chops with charred finish.", "BBQ", "849.00", "/media/foods/images/bb1_lam.jpg"),
        ("Chapli Kebab", "Smoky chapli kebab served hot.", "BBQ", "350.00", "/media/foods/images/Chapli_Kebab.jpg"),
    ],
}


class Command(BaseCommand):
    help = "Normalizes restaurant/category data and seeds menu items for empty restaurants."

    @transaction.atomic
    def handle(self, *args, **options):
        self.merge_duplicate_categories()
        self.merge_duplicate_restaurants()
        self.seed_empty_restaurants()
        self.stdout.write(self.style.SUCCESS("Restaurant catalog normalized successfully."))

    def merge_duplicate_categories(self):
        grouped = {}
        for category in Category.objects.order_by("id"):
            key = category.name.strip().lower()
            grouped.setdefault(key, []).append(category)

        for categories in grouped.values():
            primary = categories[0]
            for duplicate in categories[1:]:
                Food.objects.filter(category=duplicate).update(category=primary)
                duplicate.delete()

    def merge_duplicate_restaurants(self):
        grouped = {}
        restaurants = Restaurant.objects.prefetch_related("foods").order_by("id")
        for restaurant in restaurants:
            key = restaurant.name.strip().lower()
            grouped.setdefault(key, []).append(restaurant)

        for duplicates in grouped.values():
            if len(duplicates) < 2:
                continue

            primary = max(
                duplicates,
                key=lambda item: (item.foods.count(), -item.id),
            )

            for duplicate in duplicates:
                if duplicate.id == primary.id:
                    continue

                if duplicate.foods.exists():
                    for food in duplicate.foods.all():
                        Food.objects.update_or_create(
                            restaurant=primary,
                            name=food.name,
                            defaults={
                                "category": food.category,
                                "description": food.description,
                                "price": food.price,
                                "image": food.image,
                                "image_url": food.image_url,
                                "is_available": food.is_available,
                            },
                        )
                    duplicate.foods.all().delete()

                if not primary.logo and duplicate.logo:
                    primary.logo = duplicate.logo
                if not primary.logo_url and duplicate.logo_url:
                    primary.logo_url = duplicate.logo_url
                if not primary.address and duplicate.address:
                    primary.address = duplicate.address
                if not primary.city and duplicate.city:
                    primary.city = duplicate.city
                if not primary.theme and duplicate.theme:
                    primary.theme = duplicate.theme
                if not primary.owner and duplicate.owner:
                    primary.owner = duplicate.owner
                primary.is_active = True
                primary.save()

                if not duplicate.owner and not duplicate.foods.exists():
                    duplicate.delete()
                else:
                    duplicate.is_active = False
                    if duplicate.name == primary.name:
                        duplicate.name = f"{duplicate.name} (Archived #{duplicate.id})"
                    duplicate.save(update_fields=["is_active", "name"])

    def seed_empty_restaurants(self):
        category_cache = {}

        def get_category(name):
            if name not in category_cache:
                category_cache[name] = Category.objects.get_or_create(name=name)[0]
            return category_cache[name]

        for restaurant_name, items in MENU_TEMPLATES.items():
            restaurant = Restaurant.objects.filter(name__iexact=restaurant_name).order_by("id").first()
            if not restaurant:
                continue

            for name, description, category_name, price, image_url in items:
                Food.objects.update_or_create(
                    restaurant=restaurant,
                    name=name,
                    defaults={
                        "category": get_category(category_name),
                        "description": description,
                        "price": Decimal(price),
                        "image_url": image_url,
                        "is_available": True,
                    },
                )
