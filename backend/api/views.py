from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(["POST"])
@permission_classes([AllowAny])
def githubWebook(request):
    data = request.data

    return Response({
        "repository": data.get("repository", {}).get("full_name"),
        "branch": data.get("ref"),
        "commits": data.get("commits")
    })