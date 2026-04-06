from rest_framework.throttling import SimpleRateThrottle


class LoginThrottle(SimpleRateThrottle):
    """
    Rate limit login attempts to 5 per hour per IP
    """
    scope = "login"

    def get_cache_key(self):
        if self.request.user and self.request.user.is_authenticated:
            ident = self.request.user.pk
        else:
            ident = self.get_ident(self.request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class RegisterThrottle(SimpleRateThrottle):
    """
    Rate limit registration to 10 per hour per IP
    """
    scope = "register"

    def get_cache_key(self):
        if self.request.user and self.request.user.is_authenticated:
            ident = self.request.user.pk
        else:
            ident = self.get_ident(self.request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class TokenRefreshThrottle(SimpleRateThrottle):
    """
    Rate limit token refresh to 30 per hour
    """
    scope = "token_refresh"

    def get_cache_key(self):
        if self.request.user and self.request.user.is_authenticated:
            ident = self.request.user.pk
        else:
            ident = self.get_ident(self.request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class OrdersThrottle(SimpleRateThrottle):
    """
    Rate limit order endpoints to 50 per hour per user
    """
    scope = "orders"

    def get_cache_key(self):
        if self.request.user and self.request.user.is_authenticated:
            ident = self.request.user.pk
        else:
            ident = self.get_ident(self.request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class RestaurantsThrottle(SimpleRateThrottle):
    """
    Rate limit restaurant endpoints to 100 per hour
    """
    scope = "restaurants"

    def get_cache_key(self):
        if self.request.user and self.request.user.is_authenticated:
            ident = self.request.user.pk
        else:
            ident = self.get_ident(self.request)
        return self.cache_format % {"scope": self.scope, "ident": ident}
