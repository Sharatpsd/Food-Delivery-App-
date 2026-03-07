from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="payment",
            name="amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="payment",
            name="currency",
            field=models.CharField(default="BDT", max_length=10),
        ),
        migrations.AddField(
            model_name="payment",
            name="gateway_response",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="payment",
            name="gateway_url",
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name="payment",
            name="provider",
            field=models.CharField(default="sslcommerz", max_length=50),
        ),
        migrations.AddField(
            model_name="payment",
            name="session_key",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="payment",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("initiated", "Initiated"),
                    ("completed", "Completed"),
                    ("failed", "Failed"),
                    ("cancelled", "Cancelled"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]
