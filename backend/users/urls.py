from django.urls import path
from . import views

# Define las URL que corresponden a las vistas de usuarios.
urlpatterns = [
    # URL para el registro de usuarios.
    path("register/", views.register, name="Register User"),

    # URL para el inicio de sesión de usuarios.
    path("login/", views.login, name="Login User"),
]
