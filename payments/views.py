from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order

class InitiatePaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        order_id = self.request.data.get('order')
        order = Order.objects.get(id=order_id, customer=self.request.user)
        
        if hasattr(order, 'payment'):
            return Response({"detail": "Payment already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer.save(order=order)

class CompletePaymentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get('payment_id')
        transaction_id = request.data.get('transaction_id', '')
        
        try:
            payment = Payment.objects.get(id=payment_id, order__customer=request.user)
            payment.transaction_id = transaction_id
            payment.status = 'completed'
            payment.save()
            
            # Auto accept order after payment
            payment.order.status = 'accepted'
            payment.order.save()
            
            return Response({"detail": "Payment successful"}, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({"detail": "Invalid payment"}, status=status.HTTP_400_BAD_REQUEST)