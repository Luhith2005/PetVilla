from django.urls import path
from .views import (
    SellerDashboardStatsView,
    SellerProductListCreateView,
    SellerProductDetailView,
    SellerOrdersListView,
)

urlpatterns = [
    path("dashboard/", SellerDashboardStatsView.as_view(), name="seller-dashboard"),
    path("products/", SellerProductListCreateView.as_view(), name="seller-products"),
    path("products/<int:pk>/", SellerProductDetailView.as_view(), name="seller-product-detail"),
    path("orders/", SellerOrdersListView.as_view(), name="seller-orders"),
]
