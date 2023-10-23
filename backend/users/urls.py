from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="Register User"),
    path("login/", views.login, name="Login User"),
]
