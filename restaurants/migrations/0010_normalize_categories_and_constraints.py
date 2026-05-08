from django.db import migrations, models


def merge_duplicate_categories(apps, schema_editor):
    Category = apps.get_model("restaurants", "Category")
    Food = apps.get_model("restaurants", "Food")

    grouped = {}
    for category in Category.objects.order_by("id"):
        key = category.name.strip().lower()
        grouped.setdefault(key, []).append(category)

    for categories in grouped.values():
        primary = categories[0]
        for duplicate in categories[1:]:
            Food.objects.filter(category=duplicate).update(category=primary)
            duplicate.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("restaurants", "0009_alter_restaurant_owner_alter_restaurantrequest_owner"),
    ]

    operations = [
        migrations.RunPython(merge_duplicate_categories, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="category",
            name="name",
            field=models.CharField(max_length=150, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name="food",
            unique_together={("restaurant", "name")},
        ),
    ]
