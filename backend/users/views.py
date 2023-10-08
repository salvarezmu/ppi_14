from rest_framework import viewsets
from django.http import JsonResponse
from .serializer import UserSerializer
from .models import User
import requests


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

def validate_tron_address(request):
    if request.method == 'POST':
        address = request.POST.get('address')

        # Realiza la solicitud a la API de TRON
        response = requests.get('https://api.shasta.trongrid.io/wallet/validateaddress', params={'address': address})
        result = response.json()

        # Devuelve la respuesta al frontend
        return JsonResponse({'result': result})