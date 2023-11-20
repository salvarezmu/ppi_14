from django.urls import path

from categories import views

# Define las URL que corresponde a las vistas de categorias.
urlpatterns = [

    # Ruta para traer todas las transacciones categorizadas.
    path("get-all", views.get_all, name="Get All Transactions categorized"),

    # Ruta para categorizar una transacción.
    path("categorize", views.categorize_transaction, name="Categorize transaction"),
]
