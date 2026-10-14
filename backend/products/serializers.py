from rest_framework import serializers
from .models import Product, Category, PetType


class PetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetType
        fields = ["id", "name", "slug", "icon", "description"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "icon"]


class ProductSerializer(serializers.ModelSerializer):
    pet_type_name = serializers.ReadOnlyField(source="pet_type.name")
    category_name = serializers.ReadOnlyField(source="category.name")
    seller_username = serializers.ReadOnlyField(source="seller.username")
    final_price = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "seller_username",
            "name",
            "slug",
            "description",
            "price",
            "discount_price",
            "final_price",
            "stock",
            "in_stock",
            "pet_type",
            "pet_type_name",
            "category",
            "category_name",
            "image_url",
            "rating",
            "reviews_count",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "seller",
            "slug",
            "rating",
            "reviews_count",
            "created_at",
            "updated_at",
        ]


class ProductDetailSerializer(ProductSerializer):
    pet_type = PetTypeSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
