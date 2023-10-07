from rest_framework import viewsets
from django.http import JsonResponse
from .serializer import UserSerializer
from .models import User
from tronapi import Tron


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

def validate_address(request):
    tron = Tron(network='shasta')  # Configura la red Tron que desees utilizar
    address = request.POST.get('address')  # Obtén la dirección del usuario desde la solicitud POST
    is_valid = tron.isAddress(address)
    return JsonResponse({'is_valid': is_valid})