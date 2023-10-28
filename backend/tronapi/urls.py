from django.urls import path
from . import views

urlpatterns = [
    path("trx/get-balance/<str:address>", views.get_trx_balance, name='Get TRX Balance'),
    path("trx/get-transactions/<str:address>", views.get_trx_transactions,
         name='Get TRX Transactions'),
    path("validate-address/<str:address>", views.validate_address, name="Validate Address"),
    path('block/get-history/<str:quantity>', views.get_history_blocks, name="Get Block History"),
    path("block/get-transactions/<str:block>", views.get_block_transactions, name="Get Block Transactions"),
]
