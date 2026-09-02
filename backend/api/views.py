from django.shortcuts import render
from .models import CustomUser, Organisation
from rest_framework import generics
from .serializers import AdminRegisterSerializer, OrgMemberRegistrationSerializer, OrganisationSerializer, UserDetailsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# Create your views here.
class AdminRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = AdminRegisterSerializer
    permission_classes = [AllowAny]

class CurrentUserView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class OrganisationView(generics.GenericAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        organisation = request.user.organisation

        if organisation is None:
            return Response({"organisation": None})
        serializer = self.get_serializer(organisation)
        return Response({"organisation": serializer.data})

    def post(self, request):
        user = request.user
        if user.role != "admin":
            raise PermissionDenied(
                "Only admins can create an organisation"
            )
    
        if hasattr(user, "owned_organisation"):
            raise PermissionDenied(
                "You already own an organisation"
            )
    
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=201)

class JoinOrganisationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = OrgMemberRegistrationSerializer
    permission_classes = [AllowAny]


class GetJoinOrganisationView(generics.RetrieveAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [AllowAny]

    lookup_field = "join_token"
    lookup_url_kwarg = "token"


@api_view(["POST"])
@permission_classes([AllowAny])
def githubWebook(request):
    data = request.data

    return Response({
        "repository": data.get("repository", {}).get("full_name"),
        "branch": data.get("ref"),
        "commits": data.get("commits")
    })