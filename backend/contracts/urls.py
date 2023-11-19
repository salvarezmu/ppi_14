from django.urls import path

from contracts import views

# Define las URL que corresponde a las vistas de contratos.
urlpatterns = [

    # Ruta para obtener los contratos guardados de un usuario.
    path("get-all", views.get_all, name="Get all contracts saved"),

    # Ruta para guardar un contrato.
    path("save", views.save_contract, name="Save a TRC20 Contract")
]
