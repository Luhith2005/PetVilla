from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    FeaturedProductsView,
    CategoryListView,
    PetTypeListView,
)

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("featured/", FeaturedProductsView.as_view(), name="product-featured"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("pet-types/", PetTypeListView.as_view(), name="pet-type-list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
]
