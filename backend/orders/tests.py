from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product
from cart.models import Cart, CartItem
from orders.models import Order

User = get_user_model()


class OrderApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="order_buyer", password="Pass12345Password", user_type="customer"
        )
        self.seller = User.objects.create_user(
            username="order_seller", password="Pass12345Password", user_type="seller"
        )
        self.product = Product.objects.create(
            seller=self.seller,
            name="Cat Scratch Post",
            description="Durable post",
            price=30.00,
            stock=10,
        )
        # Put in cart
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=2)

    def test_checkout_and_place_order(self):
        self.client.force_login(self.user)
        payload = {
            "shipping_full_name": "Order Buyer",
            "shipping_email": "buyer@example.com",
            "shipping_phone": "1234567890",
            "shipping_address": "123 Pet St",
            "shipping_city": "Dogtown",
            "shipping_postal_code": "10001",
            "payment_method": "Credit Card",
        }
        resp = self.client.post("/api/orders/", payload, content_type="application/json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)

        # Check stock reduced from 10 to 8
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)

        # Check cart emptied
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.items.count(), 0)
