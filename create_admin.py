import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Check if admin exists
admin = User.objects.filter(username='admin').first()
if not admin:
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@bite.local',
        password='admin123',
        name='Admin User'
    )
    print(f"✓ Admin user created: {admin.username}")
else:
    print(f"✓ Admin user already exists: {admin.username}")
    # Update password
    admin.set_password('admin123')
    admin.save()

# Get token
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(admin)
    print(f"\nAccess Token:\n{str(refresh.access_token)}\n")
except Exception as e:
    print(f"Token generation error: {e}")
