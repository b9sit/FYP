from .models import CustomUser, Organisation
from rest_framework import serializers

class UserDetailsSerializer(serializers.ModelSerializer):
    organisation_name = serializers.CharField(source="organisation.name", read_only=True, allow_null=True)
    class Meta: 
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "role", "organisation", "organisation_name"]

class AdminRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):

        return CustomUser.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role="admin"
        )

class OrgMemberRegistrationSerializer(serializers.ModelSerializer):
    join_token = serializers.UUIDField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "join_token",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        join_token = validated_data.pop("join_token") 

        try:
            organisation = Organisation.objects.get(
                join_token=join_token
            )
        except Organisation.DoesNotExist:
            raise serializers.ValidationError(
                {"join_token": "Invalid org invite"}
            )

        user = CustomUser.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role="base",
            organisation=organisation
        )

        return user

class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ["id", "name", "join_token"]
        read_only_fields = ["join_token"]

    def create(self, validated_data):
        user = self.context["request"].user
        organisation = Organisation.objects.create(
            name=validated_data["name"],
            owner=user
        )

        user.organisation = organisation
        user.save(update_fields=["organisation"])
        return organisation