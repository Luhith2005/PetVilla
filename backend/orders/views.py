from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    """
    List logged-in user's orders or place a new order from current cart.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateOrderSerializer
        return OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")

    def perform_create(self, serializer):
        serializer.context["request.user"] = self.request.user
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.context["request.user"] = request.user
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            {
                "message": "Order placed successfully!",
                "order": OrderSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve specific order details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


class OrderCancelView(APIView):
    """
    Cancel an order if still in pending status.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status != "pending":
            return Response(
                {"detail": "Only pending orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "cancelled"
        order.save(update_fields=["status"])

        # Restore product stock
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save(update_fields=["stock"])

        return Response({"message": "Order cancelled successfully.", "order": OrderSerializer(order).data})
