from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("api/v1/users/", include("users.urls")),
    path("api/v1/tronapi/", include("tronapi.urls")),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/contract/', include("contracts.urls")),
    path('admin/', admin.site.urls),
]
