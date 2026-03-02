from django.core.management.base import BaseCommand
from restaurants.models import Restaurant
from users.models import User


class Command(BaseCommand):
    help = "Seed initial restaurants data"

    def handle(self, *args, **kwargs):

        if Restaurant.objects.exists():
            self.stdout.write(self.style.WARNING("Restaurants already seeded"))
            return

        user = User.objects.first()

        if not user:
            self.stdout.write(self.style.ERROR("No user found. Create a superuser first."))
            return

        restaurants_data = [
            {"name": "Star Kabab", "address": "Old Dhaka", "city": "Dhaka", "rating": 4.6, "theme": "Traditional"},
            {"name": "Chillox", "address": "Banani", "city": "Dhaka", "rating": 4.5, "theme": "Fast Food"},
            {"name": "Sultan's Dine", "address": "Dhanmondi", "city": "Dhaka", "rating": 4.8, "theme": "Traditional"},
        ]

        for data in restaurants_data:
            Restaurant.objects.create(
                owner=user,
                name=data["name"],
                address=data["address"],
                city=data["city"],
                rating=data["rating"],
                theme=data["theme"],
                is_active=True
            )

        self.stdout.write(self.style.SUCCESS("Restaurants seeded successfully!"))