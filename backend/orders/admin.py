from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product_name", "price", "quantity", "seller", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "user",
        "status",
        "total_amount",
        "payment_method",
        "payment_status",
        "created_at",
    ]
    list_filter = ["status", "payment_status", "created_at"]
    search_fields = ["order_number", "user__username", "shipping_full_name", "shipping_phone"]
    inlines = [OrderItemInline]
