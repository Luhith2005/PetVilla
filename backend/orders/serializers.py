from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from cart.models import Cart
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "seller",
            "product_name",
            "price",
            "quantity",
            "image_url",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "user",
            "user_username",
            "status",
            "total_amount",
            "shipping_full_name",
            "shipping_email",
            "shipping_phone",
            "shipping_address",
            "shipping_city",
            "shipping_postal_code",
            "payment_method",
            "payment_status",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "order_number", "user", "status", "created_at", "updated_at"]


class CreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "shipping_full_name",
            "shipping_email",
            "shipping_phone",
            "shipping_address",
            "shipping_city",
            "shipping_postal_code",
            "payment_method",
        ]

    def create(self, validated_data):
        user = self.context["request.user"]
        cart = Cart.objects.filter(user=user).first()

        if not cart or not cart.items.exists():
            raise serializers.ValidationError("Your cart is empty.")

        with transaction.atomic():
            cart_items = list(cart.items.select_related("product").all())
            total = sum(item.line_total for item in cart_items)

            # Check stock
            for item in cart_items:
                if item.quantity > item.product.stock:
                    raise serializers.ValidationError(
                        f"Insufficient stock for '{item.product.name}'. Available: {item.product.stock}"
                    )

            order = Order.objects.create(
                user=user,
                total_amount=total,
                **validated_data,
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    seller=item.product.seller,
                    product_name=item.product.name,
                    price=item.product.final_price,
                    quantity=item.quantity,
                    image_url=item.product.image_url,
                )
                # Deduct stock
                item.product.stock -= item.quantity
                item.product.save(update_fields=["stock"])

            # Empty user's cart
            cart.items.all().delete()

        return order
