from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()


class SellerApiTests(TestCase):
    def setUp(self):
        self.seller = User.objects.create_user(
            username="seller_dashboard_test",
            password="Pass12345Password",
            user_type="seller",
        )
        self.customer = User.objects.create_user(
            username="customer_test",
            password="Pass12345Password",
            user_type="customer",
        )
        self.product = Product.objects.create(
            seller=self.seller,
            name="Fish Tank Filter",
            description="Crystal clear water",
            price=25.00,
            stock=2,  # low stock
        )

    def test_seller_dashboard_access(self):
        # Customer should be forbidden
        self.client.force_login(self.customer)
        cust_resp = self.client.get("/api/seller/dashboard/")
        self.assertEqual(cust_resp.status_code, 403)

        # Seller should succeed
        self.client.force_login(self.seller)
        seller_resp = self.client.get("/api/seller/dashboard/")
        self.assertEqual(seller_resp.status_code, 200)
        self.assertEqual(seller_resp.json()["total_products"], 1)
        self.assertEqual(seller_resp.json()["low_stock_count"], 1)

    def test_seller_create_product(self):
        self.client.force_login(self.seller)
        payload = {
            "name": "Hamster Running Wheel",
            "description": "Silent spinner",
            "price": "12.50",
            "stock": 15,
        }
        resp = self.client.post("/api/seller/products/", payload, content_type="application/json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Product.objects.filter(seller=self.seller).count(), 2)
