from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, Category, PetType
from cart.models import Cart, CartItem

User = get_user_model()


class CartApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="buyer_test", password="Pass12345Password", user_type="customer"
        )
        self.seller = User.objects.create_user(
            username="seller_cart", password="Pass12345Password", user_type="seller"
        )
        self.product = Product.objects.create(
            seller=self.seller,
            name="Dog Leash",
            description="Sturdy leash",
            price=20.00,
            stock=15,
        )

    def test_add_and_get_cart_item(self):
        self.client.force_login(self.user)
        # Add item to cart
        add_resp = self.client.post(
            "/api/cart/items/",
            {"product_id": self.product.id, "quantity": 2},
            content_type="application/json",
        )
        self.assertEqual(add_resp.status_code, 200)
        self.assertEqual(add_resp.json()["cart"]["total_items"], 2)

        # Get cart
        get_resp = self.client.get("/api/cart/")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(len(get_resp.json()["cart"]["items"]), 1)
        self.assertEqual(float(get_resp.json()["cart"]["total_price"]), 40.0)
