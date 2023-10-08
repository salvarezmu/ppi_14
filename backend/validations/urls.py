from django.urls import path
from . import views  # Importa las vistas de la aplicación 'validations'

urlpatterns = [
    path('', views.validate_address),
]
