import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# Delete old admin if exists
User.objects.filter(username='admin').delete()

# Create fresh admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@bite.local',
    password='admin123',
    name='Admin User',
    role='admin'
)

print(f"✓ Admin created successfully")
print(f"  Username: {admin.username}")
print(f"  Email: {admin.email}")
print(f"  Role: {admin.role}")
print(f"  Password: admin123")
