from django.contrib import admin
from django.urls import path, include
from api.views import AdminRegisterView, CurrentUserView, OrganisationView, GetJoinOrganisationView, JoinOrganisationView, githubWebook
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', AdminRegisterView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include("rest_framework.urls")),

    path('api/user/', CurrentUserView.as_view(), name="user_details"),

    path('api/organisation/join/<uuid:token>/', GetJoinOrganisationView.as_view(), name="org_join"),
    path('api/user/join/', JoinOrganisationView.as_view(), name="user_join"),

    path('api/organisation/', OrganisationView.as_view(), name="organisation"),

    path('webhook/', githubWebook, name="commit_webhook")
]
