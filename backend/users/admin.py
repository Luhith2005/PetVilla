
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class PetVillaUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("PetVilla Information", {"fields": ("user_type",)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("PetVilla Information", {"fields": ("user_type",)}),
    )

    list_display = (
        "username",
        "email",
        "user_type",
        "is_staff",
        "is_active",
    )
