from django.urls import path
from . import views

urlpatterns = [
    path("trx/get-balance/<str:address>", views.get_trx_balance, name='Get TRX Balance'),
    path("trx/get-transactions/<str:address>/<int:min_date>/<int:max_date>", views.get_trx_transactions, name='Get TRX Transactions'),
    path("validate-address/<str:address>", views.validate_address, name="Validate Address"),
]
