from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import DeliveryRequest, RestaurantRequest


User = get_user_model()


class PartnerRequestTests(APITestCase):
    def test_restaurant_request_accepts_frontend_alias_fields(self):
        customer = User.objects.create_user(
            username="customer-a",
            password="pass1234",
            role="customer",
            name="Customer A",
        )
        self.client.force_authenticate(customer)

        response = self.client.post(
            "/api/restaurants/restaurant-requests/",
            {
                "restaurantName": "Alias Bistro",
                "phone": "01711111111",
                "email": "owner@example.com",
                "address": "Dhaka",
                "license": "TRADE-123",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        request_obj = RestaurantRequest.objects.get(owner=customer)
        self.assertEqual(request_obj.name, "Alias Bistro")
        self.assertIn("Phone: 01711111111", request_obj.note)
        self.assertIn("License: TRADE-123", request_obj.note)

    def test_delivery_request_accepts_frontend_alias_fields(self):
        customer = User.objects.create_user(
            username="customer-b",
            password="pass1234",
            role="customer",
            name="Customer B",
        )
        self.client.force_authenticate(customer)

        response = self.client.post(
            "/api/restaurants/delivery-requests/",
            {
                "name": "Customer B",
                "phone": "01722222222",
                "address": "Dhaka, Bangladesh",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        request_obj = DeliveryRequest.objects.get(user=customer)
        self.assertEqual(request_obj.full_name, "Customer B")
        self.assertEqual(request_obj.phone, "01722222222")

    def test_non_admin_users_only_see_their_own_requests(self):
        owner = User.objects.create_user(
            username="owner-1",
            password="pass1234",
            role="customer",
            name="Owner One",
        )
        other_user = User.objects.create_user(
            username="owner-2",
            password="pass1234",
            role="customer",
            name="Owner Two",
        )
        RestaurantRequest.objects.create(owner=owner, name="Owner One Request")

        self.client.force_authenticate(other_user)
        response = self.client.get("/api/restaurants/restaurant-requests/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 0)
