from django.urls import path
from . import views

# Define las URL que corresponden a las vistas de usuarios.
urlpatterns = [
    # URL para el registro de usuarios.
    path("register/", views.register, name="Register User"),

    # URL para el inicio de sesión de usuarios.
    path("login/", views.login, name="Login User"),

    # URL para la eliminación de usuarios.
    path('delete-account/', views.delete_account, name='Delete Account'),

    # URL para actualizar un usuario.
    path('update-account/', views.update_user, name='Update Account'),

    # URL para actualizar la contraseña de un usuario.
    path('update-password/', views.update_password, name='Update Password'),
]
