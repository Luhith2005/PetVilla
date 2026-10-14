from django.contrib import admin
from .models import Product, Category, PetType


@admin.register(PetType)
class PetTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "icon"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "icon"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "seller",
        "price",
        "discount_price",
        "stock",
        "pet_type",
        "category",
        "is_featured",
        "is_active",
        "created_at",
    ]
    list_filter = ["is_active", "is_featured", "pet_type", "category"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
