from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .serializers import PaymentSerializer
from .models import Payment
from orders.models import Order
from users.permissions import IsCustomer


# --------------------------
# 1️⃣ Initiate Payment (Customer)
# --------------------------
class InitiatePaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def create(self, request, *args, **kwargs):
        order_id = request.data.get("order")
        method = request.data.get("method")

        if not order_id:
            return Response({"detail": "Order ID required"}, status=400)

        if method not in ["bkash", "nagad", "card", "cod"]:
            return Response({"detail": "Invalid payment method"}, status=400)

        try:
            order = Order.objects.get(id=order_id, customer=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=404)

        if hasattr(order, "payment"):
            return Response({"detail": "Payment already exists"}, status=400)

        # COD (Cash On Delivery) → instant confirm
        if method == "cod":
            payment = Payment.objects.create(order=order, method="cod", status="completed")
            order.status = "accepted"
            order.save()
            return Response({"detail": "Order accepted with COD"}, status=200)

        # Online payment (pending)
        payment = Payment.objects.create(order=order, method=method)
        serializer = self.get_serializer(payment)
        return Response(serializer.data, status=201)


# --------------------------
# 2️⃣ Complete Digital Payment
# --------------------------
class CompletePaymentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        transaction_id = request.data.get("transaction_id")

        if not payment_id:
            return Response({"detail": "payment_id required"}, status=400)

        if not transaction_id:
            return Response({"detail": "transaction_id required"}, status=400)

        try:
            with transaction.atomic():
                payment = Payment.objects.select_for_update().get(
                    id=payment_id,
                    order__customer=request.user
                )

                if payment.status == "completed":
                    return Response({"detail": "Payment already completed"}, status=400)

                payment.transaction_id = transaction_id
                payment.status = "completed"
                payment.save()

                order = payment.order
                order.status = "accepted"
                order.save()

        except Payment.DoesNotExist:
            return Response({"detail": "Invalid payment"}, status=404)

        return Response({"detail": "Payment successful!"}, status=200)
