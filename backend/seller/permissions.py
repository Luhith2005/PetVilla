from rest_framework import permissions


class IsSellerUser(permissions.BasePermission):
    """
    Allows access only to authenticated users with user_type == 'seller'.
    """
    message = "Access restricted to Seller accounts only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "user_type", "") == "seller"
        )
