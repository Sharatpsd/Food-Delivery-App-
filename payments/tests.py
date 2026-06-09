from rest_framework.test import APITestCase


class PaymentUrlTests(APITestCase):
    def test_legacy_complete_payment_endpoint_is_not_exposed(self):
        response = self.client.post("/api/payments/complete/", {}, format="json")
        self.assertEqual(response.status_code, 404)
