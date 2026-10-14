
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # This field is write-only: it is accepted on input
    # but never returned in the response.
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "user_type",
        ]
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
        }

    def validate_user_type(self, value):
        if value not in ["customer", "seller"]:
            raise serializers.ValidationError(
                "User type must be customer or seller."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        # create_user hashes the password securely.
        user = User.objects.create_user(
            password=password,
            **validated_data,
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "user_type"]
        read_only_fields = ["id", "username", "user_type"]

