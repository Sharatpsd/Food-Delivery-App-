from rest_framework import serializers

from .models import Category, DeliveryRequest, Food, Restaurant, RestaurantRequest


def build_media_url(request, file_field, fallback_url):
    if file_field:
        local_url = file_field.url
        return request.build_absolute_uri(local_url) if request else local_url
    return fallback_url or None


class RestaurantRequestSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    restaurantName = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True, required=False)
    license = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = RestaurantRequest
        fields = (
            "id",
            "owner",
            "name",
            "restaurantName",
            "logo",
            "address",
            "city",
            "avg_cost",
            "theme",
            "must_try",
            "timings",
            "website",
            "social",
            "note",
            "phone",
            "email",
            "license",
            "role",
            "approved",
            "created_at",
        )
        read_only_fields = ("approved", "created_at", "owner")

    def validate(self, attrs):
        attrs = super().validate(attrs)

        if not attrs.get("name") and attrs.get("restaurantName"):
            attrs["name"] = attrs["restaurantName"].strip()

        if not attrs.get("name"):
            raise serializers.ValidationError({"name": "Restaurant name is required."})

        request = self.context.get("request")
        if request and request.user.is_authenticated and not self.instance:
            if RestaurantRequest.objects.filter(owner=request.user, approved=False).exists():
                raise serializers.ValidationError(
                    {"detail": "You already have a pending restaurant request."}
                )

        return attrs

    def create(self, validated_data):
        restaurant_name = validated_data.pop("restaurantName", "").strip()
        phone = validated_data.pop("phone", "").strip()
        email = validated_data.pop("email", "").strip()
        license_number = validated_data.pop("license", "").strip()
        validated_data.pop("role", None)

        if not validated_data.get("name") and restaurant_name:
            validated_data["name"] = restaurant_name

        note_parts = [validated_data.get("note", "").strip()]
        if phone:
            note_parts.append(f"Phone: {phone}")
        if email:
            note_parts.append(f"Email: {email}")
        if license_number:
            note_parts.append(f"License: {license_number}")
        validated_data["note"] = "\n".join(part for part in note_parts if part)

        return super().create(validated_data)


class DeliveryRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    photo = serializers.FileField(write_only=True, required=False, allow_empty_file=False)
    vehicle = serializers.CharField(write_only=True, required=False, allow_blank=True)
    license = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = DeliveryRequest
        fields = (
            "id",
            "user",
            "full_name",
            "phone",
            "city",
            "id_document",
            "name",
            "email",
            "address",
            "photo",
            "vehicle",
            "license",
            "role",
            "approved",
            "created_at",
        )
        read_only_fields = ("approved", "created_at", "user")

    def validate(self, attrs):
        attrs = super().validate(attrs)

        if not attrs.get("full_name") and attrs.get("name"):
            attrs["full_name"] = attrs["name"].strip()
        if not attrs.get("id_document") and attrs.get("photo"):
            attrs["id_document"] = attrs["photo"]

        if not attrs.get("full_name"):
            raise serializers.ValidationError({"full_name": "Full name is required."})
        if not attrs.get("phone"):
            raise serializers.ValidationError({"phone": "Phone is required."})

        request = self.context.get("request")
        if request and request.user.is_authenticated and not self.instance:
            if DeliveryRequest.objects.filter(user=request.user, approved=False).exists():
                raise serializers.ValidationError(
                    {"detail": "You already have a pending delivery request."}
                )

        return attrs

    def create(self, validated_data):
        name = validated_data.pop("name", "").strip()
        validated_data.pop("email", None)
        address = validated_data.pop("address", "").strip()
        photo = validated_data.pop("photo", None)
        validated_data.pop("vehicle", None)
        validated_data.pop("license", None)
        validated_data.pop("role", None)

        if not validated_data.get("full_name") and name:
            validated_data["full_name"] = name
        if not validated_data.get("id_document") and photo is not None:
            validated_data["id_document"] = photo
        if not validated_data.get("city") and address:
            validated_data["city"] = address[:150]

        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class FoodSerializer(serializers.ModelSerializer):
    image_final = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Food
        fields = "__all__"

    def get_image_final(self, obj):
        return build_media_url(self.context.get("request"), obj.image, obj.image_url)


class RestaurantSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = "__all__"

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)


class RestaurantListSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()
    food_count = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'city',
            'rating',
            'theme',
            'address',
            'logo_final',
            'food_count',
        ]

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)

    def get_food_count(self, obj):
        annotated_count = getattr(obj, "available_food_count", None)
        if annotated_count is not None:
            return annotated_count
        return obj.foods.filter(is_available=True).count()


class FoodMenuSerializer(serializers.ModelSerializer):
    image_final = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.name', read_only=True)
    restaurant = serializers.IntegerField(source='restaurant_id', read_only=True)

    class Meta:
        model = Food
        fields = [
            'id',
            'restaurant',
            'category',
            'name',
            'description',
            'price',
            'image',
            'image_url',
            'image_final',
            'is_available',
        ]

    def get_image_final(self, obj):
        return build_media_url(self.context.get("request"), obj.image, obj.image_url)


class RestaurantDetailSerializer(serializers.ModelSerializer):
    logo_final = serializers.SerializerMethodField()
    foods = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'city',
            'rating',
            'theme',
            'address',
            'logo',
            'logo_url',
            'logo_final',
            'foods',
        ]

    def get_logo_final(self, obj):
        return build_media_url(self.context.get("request"), obj.logo, obj.logo_url)

    def get_foods(self, obj):
        foods = obj.foods.filter(is_available=True).select_related('category').order_by('name')
        return FoodMenuSerializer(foods, many=True, context=self.context).data
