from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username','password')}),
        ("Personal", {'fields': ('name','phone','address','role')}),
        ("Permissions", {'fields': ('is_active','is_superuser','is_staff','groups','user_permissions')}),
        ("Important", {'fields': ('last_login','date_joined')}),
    )
