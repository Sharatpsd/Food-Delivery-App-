from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['food', 'quantity', 'price']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'restaurant', 'total', 'status', 'created_at', 'assigned_delivery_boy']
    list_filter = ['status', 'created_at', 'restaurant']
    search_fields = ['id', 'customer__username', 'restaurant__name']
    readonly_fields = ['total', 'created_at']
    inlines = [OrderItemInline] 