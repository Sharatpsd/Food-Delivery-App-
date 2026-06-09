from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from restaurants.models import DeliveryRequest, Restaurant, RestaurantRequest


User = get_user_model()


class AdminApprovalTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin",
            password="pass1234",
            role="admin",
            name="Admin User",
        )
        self.client.force_authenticate(self.admin)

    def test_restaurant_approval_marks_request_approved_and_updates_owner_role(self):
        owner = User.objects.create_user(
            username="customer1",
            password="pass1234",
            role="customer",
            name="Customer One",
        )
        request_obj = RestaurantRequest.objects.create(
            owner=owner,
            name="Spice Hub",
            address="Dhaka",
            city="Dhaka",
            theme="Bangla",
        )

        response = self.client.post(f"/api/admin/restaurant-requests/{request_obj.id}/approve/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Restaurant.objects.filter(name="Spice Hub", city="Dhaka").count(), 1)

        request_obj.refresh_from_db()
        owner.refresh_from_db()
        self.assertTrue(request_obj.approved)
        self.assertEqual(owner.role, "restaurant")

    def test_restaurant_approval_reuses_existing_restaurant_instead_of_creating_duplicate(self):
        owner = User.objects.create_user(
            username="customer2",
            password="pass1234",
            role="customer",
            name="Customer Two",
        )
        Restaurant.objects.create(name="Cafe Lane", city="Dhaka", address="Old address")
        request_obj = RestaurantRequest.objects.create(
            owner=owner,
            name="Cafe Lane",
            address="New address",
            city="Dhaka",
            theme="Cafe",
        )

        response = self.client.post(f"/api/admin/restaurant-requests/{request_obj.id}/approve/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Restaurant.objects.filter(name="Cafe Lane", city="Dhaka").count(), 1)

    def test_delivery_approval_uses_delivery_requests(self):
        customer = User.objects.create_user(
            username="rider-applicant",
            password="pass1234",
            role="customer",
            name="Rider Applicant",
            email="rider@example.com",
        )
        delivery_request = DeliveryRequest.objects.create(
            user=customer,
            full_name="Rider Applicant",
            phone="01700000000",
            city="Dhaka",
        )

        list_response = self.client.get("/api/admin/delivery-agents/approvals/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.data[0]["id"], delivery_request.id)

        approve_response = self.client.post(
            "/api/admin/delivery-agents/approvals/",
            {"agent_id": delivery_request.id},
            format="json",
        )

        self.assertEqual(approve_response.status_code, 200)

        delivery_request.refresh_from_db()
        customer.refresh_from_db()
        self.assertTrue(delivery_request.approved)
        self.assertEqual(customer.role, "delivery")
