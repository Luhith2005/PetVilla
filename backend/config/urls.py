"""
URL configuration for PetVilla backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "project": "PetVilla API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "users": "/api/users/",
            "products": "/api/products/",
            "featured_products": "/api/products/featured/",
            "categories": "/api/products/categories/",
            "pet_types": "/api/products/pet-types/",
            "cart": "/api/cart/",
            "orders": "/api/orders/",
            "seller": "/api/seller/",
        }
    })


urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root-base"),
    path("api/users/", include("users.urls")),
    path("api/products/", include("products.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/seller/", include("seller.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
