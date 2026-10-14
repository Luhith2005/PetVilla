from django.urls import path
from .views import CartDetailView, CartItemAddOrUpdateView, CartItemDetailView

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart-detail"),
    path("items/", CartItemAddOrUpdateView.as_view(), name="cart-item-add"),
    path("items/<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
]
