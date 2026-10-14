from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count

from .permissions import IsSellerUser
from products.models import Product
from products.serializers import ProductSerializer, ProductDetailSerializer
from orders.models import OrderItem, Order
from orders.serializers import OrderItemSerializer


class SellerDashboardStatsView(APIView):
    """
    Get seller KPI metrics: products count, units sold, total revenue, low stock.
    """
    permission_classes = [IsSellerUser]

    def get(self, request):
        seller = request.user
        products_qs = Product.objects.filter(seller=seller)
        total_products = products_qs.count()
        low_stock_count = products_qs.filter(stock__lte=3).count()

        order_items = OrderItem.objects.filter(seller=seller)
        total_items_sold = order_items.aggregate(total=Sum("quantity"))["total"] or 0
        total_revenue = sum(item.line_total for item in order_items)
        orders_count = Order.objects.filter(items__seller=seller).distinct().count()

        recent_sales = order_items.select_related("order", "order__user").order_by("-order__created_at")[:5]
        recent_sales_data = [
            {
                "id": item.id,
                "order_number": item.order.order_number,
                "customer": item.order.shipping_full_name or item.order.user.username,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "line_total": float(item.line_total),
                "status": item.order.status,
                "created_at": item.order.created_at,
            }
            for item in recent_sales
        ]

        return Response({
            "seller": seller.username,
            "total_products": total_products,
            "low_stock_count": low_stock_count,
            "total_items_sold": total_items_sold,
            "total_revenue": float(total_revenue),
            "total_orders_received": orders_count,
            "recent_sales": recent_sales_data,
        })


class SellerProductListCreateView(generics.ListCreateAPIView):
    """
    List seller's products or create a new product.
    """
    permission_classes = [IsSellerUser]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class SellerProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a product owned by the seller.
    """
    permission_classes = [IsSellerUser]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class SellerOrdersListView(APIView):
    """
    List all order items placed for this seller's products.
    """
    permission_classes = [IsSellerUser]

    def get(self, request):
        items = (
            OrderItem.objects.filter(seller=request.user)
            .select_related("order", "order__user")
            .order_by("-order__created_at")
        )
        data = [
            {
                "id": item.id,
                "order_number": item.order.order_number,
                "customer_name": item.order.shipping_full_name or item.order.user.username,
                "customer_email": item.order.shipping_email or item.order.user.email,
                "customer_phone": item.order.shipping_phone,
                "shipping_city": item.order.shipping_city,
                "product_name": item.product_name,
                "price": float(item.price),
                "quantity": item.quantity,
                "line_total": float(item.line_total),
                "order_status": item.order.status,
                "created_at": item.order.created_at,
            }
            for item in items
        ]
        return Response({"orders": data})
