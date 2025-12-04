from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    """
    Allow read-only access to everyone,
    but write/delete access only to the owner of the object.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return hasattr(obj, "owner") and obj.owner == request.user


class IsRestaurantOwner(BasePermission):
    """
    Only users with role 'restaurant'
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "restaurant"
        )


class IsDeliveryBoy(BasePermission):
    """
    Only delivery role users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "delivery"
        )


class IsCustomer(BasePermission):
    """
    Only customer role users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "customer"
        )
