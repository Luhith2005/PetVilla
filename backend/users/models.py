
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    PetVilla user.

    A user can be a customer or a seller.
    Django automatically hashes the password
    when we use create_user().
    """

    CUSTOMER = "customer"
    SELLER = "seller"

    USER_TYPE_CHOICES = [
        (CUSTOMER, "Customer"),
        (SELLER, "Seller"),
    ]

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default=CUSTOMER,
    )

    def __str__(self):
        return f"{self.username} ({self.user_type})"
