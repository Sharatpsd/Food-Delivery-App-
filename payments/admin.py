from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'method', 'status', 'transaction_id']
    list_filter = ['method', 'status']
    search_fields = ['order__id', 'transaction_id']
    readonly_fields = ['order', 'method', 'transaction_id']

    def has_add_permission(self, request):
        
        return False