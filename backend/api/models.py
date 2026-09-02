from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractUser

USER_ROLES = [
    ("admin", "Admin"),
    ("base", "Base"),
]

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    organisation = models.ForeignKey("Organisation", on_delete=models.CASCADE, null=True, blank=True)
    team = models.ForeignKey("Team", on_delete=models.SET_NULL, null=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

class Organisation(models.Model):
    name = models.CharField(max_length=200)
    join_token = models.UUIDField(default=uuid4, unique=True, editable=False)
    owner = models.OneToOneField(CustomUser, on_delete=models.PROTECT, related_name="owned_organisation")

class Team(models.Model):
    name = models.CharField(max_length=100)
    organisation = models.ForeignKey("Organisation", on_delete=models.CASCADE)

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    organisation = models.ForeignKey("Organisation", on_delete=models.CASCADE)
    teams = models.ManyToManyField(Team)