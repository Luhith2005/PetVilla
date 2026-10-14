from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
import uuid

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        # If guest session_key header provided, merge guest cart into user cart
        guest_key = request.headers.get("X-Session-Key")
        if guest_key:
            try:
                guest_cart = Cart.objects.filter(session_key=guest_key).first()
                if guest_cart and guest_cart.id != cart.id:
                    for g_item in guest_cart.items.all():
                        item, created = CartItem.objects.get_or_create(
                            cart=cart,
                            product=g_item.product,
                            defaults={"quantity": g_item.quantity},
                        )
                        if not created:
                            item.quantity += g_item.quantity
                            item.save()
                    guest_cart.delete()
            except Exception:
                pass
        return cart

    # Guest user: track via header or query param or auto-generated session
    session_key = request.headers.get("X-Session-Key")
    if not session_key:
        session_key = str(uuid.uuid4())
    cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
    return cart


class CartDetailView(APIView):
    """
    Get the current user or guest cart, or clear the cart.
    """
    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response({
            "cart": serializer.data,
            "session_key": cart.session_key or ""
        })

    def delete(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        return Response({"message": "Cart cleared successfully"}, status=status.HTTP_200_OK)


class CartItemAddOrUpdateView(APIView):
    """
    Add a product to cart or increment/decrement quantity.
    Body: { "product_id": 1, "quantity": 1 }
    """
    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response(
                {"detail": "product_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, pk=product_id, is_active=True)

        if product.stock < 1:
            return Response(
                {"detail": "Product is out of stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response(
                    {"detail": f"Only {product.stock} items available in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if new_quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = new_quantity
                cart_item.save()

        cart.refresh_from_db()
        return Response(
            {
                "message": "Cart updated",
                "cart": CartSerializer(cart).data,
                "session_key": cart.session_key or "",
            },
            status=status.HTTP_200_OK,
        )


class CartItemDetailView(APIView):
    """
    Update quantity directly or delete specific item in cart.
    PATCH /api/cart/items/<id>/ -> { "quantity": 3 }
    DELETE /api/cart/items/<id>/
    """
    def patch(self, request, pk):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {"detail": "quantity is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quantity = int(quantity)
        if quantity <= 0:
            item.delete()
        else:
            if quantity > item.product.stock:
                return Response(
                    {"detail": f"Only {item.product.stock} items available in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.quantity = quantity
            item.save()

        cart.refresh_from_db()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        item.delete()
        cart.refresh_from_db()
        return Response(
            {
                "message": "Item removed from cart",
                "cart": CartSerializer(cart).data,
            },
            status=status.HTTP_200_OK,
        )
