from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'', views.UserView, 'users')

urlpatterns = [
    path("", include(router.urls)),
    path('api/validate-address/', views.validate_tron_address, name='validate_tron_address'),
]
