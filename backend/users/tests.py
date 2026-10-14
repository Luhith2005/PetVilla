from django.contrib.auth import get_user_model
from django.test import TestCase


class UserAuthTests(TestCase):
    def test_register_and_login_user(self):
        response = self.client.post(
            "/api/users/register/",
            {
                "username": "alice",
                "password": "StrongPass123",
                "user_type": "customer",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(get_user_model().objects.count(), 1)

        login_response = self.client.post(
            "/api/users/login/",
            {"username": "alice", "password": "StrongPass123"},
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertIn("access", login_response.json())
        self.assertIn("refresh", login_response.json())
