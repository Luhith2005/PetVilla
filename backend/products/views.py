from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import Product, Category, PetType
from .serializers import (
    ProductSerializer,
    ProductDetailSerializer,
    CategorySerializer,
    PetTypeSerializer,
)


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.CharFilter(method="filter_category")
    pet_type = django_filters.CharFilter(method="filter_pet_type")

    class Meta:
        model = Product
        fields = ["category", "pet_type", "is_featured", "is_active"]

    def filter_category(self, queryset, name, value):
        if value.isdigit():
            return queryset.filter(category_id=int(value))
        return queryset.filter(category__slug=value)

    def filter_pet_type(self, queryset, name, value):
        if value.isdigit():
            return queryset.filter(pet_type_id=int(value))
        return queryset.filter(pet_type__slug=value)


class ProductListView(generics.ListAPIView):
    """
    List all active products with comprehensive search, filter, and ordering.
    """
    queryset = Product.objects.filter(is_active=True).select_related(
        "pet_type", "category", "seller"
    )
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "category__name", "pet_type__name"]
    ordering_fields = ["price", "rating", "created_at", "name"]
    ordering = ["-created_at"]


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve single product by id or slug.
    """
    queryset = Product.objects.filter(is_active=True).select_related(
        "pet_type", "category", "seller"
    )
    serializer_class = ProductDetailSerializer


class FeaturedProductsView(generics.ListAPIView):
    """
    List featured products for homepage spotlight.
    """
    queryset = Product.objects.filter(is_active=True, is_featured=True).select_related(
        "pet_type", "category", "seller"
    )[:8]
    serializer_class = ProductSerializer
    pagination_class = None


class CategoryListView(generics.ListAPIView):
    """
    List all product categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class PetTypeListView(generics.ListAPIView):
    """
    List all pet types (Dogs, Cats, Birds, Fish, etc.)
    """
    queryset = PetType.objects.all()
    serializer_class = PetTypeSerializer
    pagination_class = None
