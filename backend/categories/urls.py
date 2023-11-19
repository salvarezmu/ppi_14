from django.urls import path

from categories import views

urlpatterns = [
    path("categorize", views.categorize_transaction, name="Categorize transaction"),
]
