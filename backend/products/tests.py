from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Product, Category, PetType

User = get_user_model()


class ProductApiTests(TestCase):
    def setUp(self):
        self.seller = User.objects.create_user(
            username="seller_test", password="Pass12345Password", user_type="seller"
        )
        self.pet_type = PetType.objects.create(name="Dog", slug="dogs")
        self.category = Category.objects.create(name="Food", slug="food")
        self.product = Product.objects.create(
            seller=self.seller,
            name="Chew Bone",
            description="Tasty chew bone",
            price=15.00,
            stock=10,
            pet_type=self.pet_type,
            category=self.category,
            is_featured=True,
        )

    def test_list_products(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json()["count"], 1)

    def test_filter_by_pet_type(self):
        response = self.client.get("/api/products/?pet_type=dogs")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)

    def test_featured_products(self):
        response = self.client.get("/api/products/featured/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_product_detail(self):
        response = self.client.get(f"/api/products/{self.product.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Chew Bone")
