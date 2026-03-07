import time
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.db import transaction
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from users.permissions import IsCustomer
from .models import Payment
from .serializers import PaymentSerializer


def _ssl_base_url():
    if settings.SSLCOMMERZ_IS_SANDBOX:
        return "https://sandbox.sslcommerz.com"
    return "https://securepay.sslcommerz.com"


def _frontend_checkout_redirect(status, order_id):
    base = settings.FRONTEND_BASE_URL.rstrip("/")
    query = urlencode({"payment_status": status, "order_id": order_id})
    return f"{base}/checkout?{query}"


def _validate_ssl_transaction(val_id):
    if not val_id:
        return False, {}
    if not settings.SSLCOMMERZ_STORE_ID or not settings.SSLCOMMERZ_STORE_PASSWORD:
        return False, {"detail": "SSLCOMMERZ credentials are not configured"}

    try:
        response = requests.get(
            f"{_ssl_base_url()}/validator/api/validationserverAPI.php",
            params={
                "val_id": val_id,
                "store_id": settings.SSLCOMMERZ_STORE_ID,
                "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
                "format": "json",
            },
            timeout=20,
        )
        data = response.json()
        status = str(data.get("status", "")).upper()
        return status in {"VALID", "VALIDATED"}, data
    except Exception as exc:
        return False, {"detail": str(exc)}


def _init_sslcommerz(payment, request):
    if not settings.SSLCOMMERZ_STORE_ID or not settings.SSLCOMMERZ_STORE_PASSWORD:
        raise ValueError("SSLCOMMERZ credentials are not configured")

    tran_id = f"PAY-{payment.id}-{int(time.time())}"
    callback_base = request.build_absolute_uri("/api/payments/callback/")

    payload = {
        "store_id": settings.SSLCOMMERZ_STORE_ID,
        "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
        "total_amount": str(payment.amount),
        "currency": payment.currency,
        "tran_id": tran_id,
        "success_url": f"{callback_base}success/",
        "fail_url": f"{callback_base}fail/",
        "cancel_url": f"{callback_base}cancel/",
        "ipn_url": f"{callback_base}ipn/",
        "emi_option": 0,
        "cus_name": payment.order.customer.name or payment.order.customer.username,
        "cus_email": payment.order.customer.username,
        "cus_phone": payment.order.customer.phone or "01700000000",
        "cus_add1": payment.order.customer.address or "Dhaka",
        "cus_city": payment.order.restaurant.city or "Dhaka",
        "cus_country": "Bangladesh",
        "shipping_method": "NO",
        "product_name": f"Order #{payment.order_id}",
        "product_category": "Food",
        "product_profile": "general",
        "value_a": str(payment.id),
        "value_b": str(payment.order_id),
    }

    response = requests.post(
        f"{_ssl_base_url()}/gwprocess/v4/api.php",
        data=payload,
        timeout=30,
    )
    data = response.json()

    if str(data.get("status", "")).upper() != "SUCCESS":
        raise ValueError(data.get("failedreason") or "Failed to initialize payment")

    payment.transaction_id = tran_id
    payment.session_key = data.get("sessionkey", "")
    payment.gateway_url = data.get("GatewayPageURL", "")
    payment.gateway_response = data
    payment.status = "initiated"
    payment.save(update_fields=[
        "transaction_id",
        "session_key",
        "gateway_url",
        "gateway_response",
        "status",
    ])


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

        if order.status == "cancelled":
            return Response({"detail": "Cancelled order can't be paid"}, status=400)

        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={
                "method": method,
                "amount": order.total,
                "provider": "sslcommerz" if method != "cod" else "cod",
            },
        )

        if payment.status == "completed":
            return Response({"detail": "Payment already completed"}, status=400)

        payment.method = method
        payment.amount = order.total
        payment.provider = "sslcommerz" if method != "cod" else "cod"
        payment.save(update_fields=["method", "amount", "provider"])

        if method == "cod":
            payment.status = "completed"
            payment.transaction_id = payment.transaction_id or f"COD-{order.id}"
            payment.save(update_fields=["status", "transaction_id"])

            order.status = "accepted"
            order.save(update_fields=["status"])

            serializer = self.get_serializer(payment)
            return Response(
                {"detail": "Order accepted with COD", "payment": serializer.data},
                status=200,
            )

        try:
            _init_sslcommerz(payment, request)
        except Exception as exc:
            payment.status = "failed"
            payment.gateway_response = {"detail": str(exc)}
            payment.save(update_fields=["status", "gateway_response"])
            return Response({"detail": str(exc)}, status=400)

        serializer = self.get_serializer(payment)
        return Response(serializer.data, status=201)


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
                    order__customer=request.user,
                )

                if payment.status == "completed":
                    return Response({"detail": "Payment already completed"}, status=400)

                payment.transaction_id = transaction_id
                payment.status = "completed"
                payment.save(update_fields=["transaction_id", "status"])

                order = payment.order
                order.status = "accepted"
                order.save(update_fields=["status"])

        except Payment.DoesNotExist:
            return Response({"detail": "Invalid payment"}, status=404)

        return Response({"detail": "Payment successful!"}, status=200)


class PaymentStatusView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    lookup_url_kwarg = "order_id"

    def get_object(self):
        return get_object_or_404(
            Payment,
            order_id=self.kwargs["order_id"],
            order__customer=self.request.user,
        )


class _SSLCallbackBase(APIView):
    permission_classes = [permissions.AllowAny]

    target_status = "failed"

    def get_payload(self, request):
        if request.method == "POST":
            return request.data
        return request.query_params

    def finalize_payment(self, request):
        payload = self.get_payload(request)
        payment_id = payload.get("value_a")
        tran_id = payload.get("tran_id")
        val_id = payload.get("val_id")

        if not payment_id:
            return HttpResponseRedirect(_frontend_checkout_redirect("failed", ""))

        payment = Payment.objects.filter(id=payment_id).select_related("order").first()
        if not payment:
            return HttpResponseRedirect(_frontend_checkout_redirect("failed", ""))

        if self.target_status == "completed":
            is_valid, validation_data = _validate_ssl_transaction(val_id)
            if is_valid:
                payment.status = "completed"
                payment.transaction_id = tran_id or payment.transaction_id
                payment.gateway_response = {"callback": dict(payload), "validation": validation_data}
                payment.save(update_fields=["status", "transaction_id", "gateway_response"])

                order = payment.order
                order.status = "accepted"
                order.save(update_fields=["status"])
                status = "success"
            else:
                payment.status = "failed"
                payment.gateway_response = {"callback": dict(payload), "validation": validation_data}
                payment.save(update_fields=["status", "gateway_response"])
                status = "failed"
        else:
            payment.status = self.target_status
            payment.gateway_response = {"callback": dict(payload)}
            if tran_id:
                payment.transaction_id = tran_id
                payment.save(update_fields=["status", "transaction_id", "gateway_response"])
            else:
                payment.save(update_fields=["status", "gateway_response"])
            status = "cancelled" if self.target_status == "cancelled" else "failed"

        return HttpResponseRedirect(_frontend_checkout_redirect(status, payment.order_id))

    def post(self, request):
        return self.finalize_payment(request)

    def get(self, request):
        return self.finalize_payment(request)


class SSLCommerzSuccessCallbackView(_SSLCallbackBase):
    target_status = "completed"


class SSLCommerzFailCallbackView(_SSLCallbackBase):
    target_status = "failed"


class SSLCommerzCancelCallbackView(_SSLCallbackBase):
    target_status = "cancelled"


class SSLCommerzIPNView(_SSLCallbackBase):
    target_status = "completed"
