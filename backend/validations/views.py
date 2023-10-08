from django.http import JsonResponse
import requests

adress = 'asdasdsadasdasdasd '

def validate_address(request):
    if request.method == 'POST':
        address = request.POST.get('address')

        # Realiza la solicitud a la API de TRON
        response = requests.get('https://api.shasta.trongrid.io/wallet/validateaddress', params={'address': address})
        result = response.json()

        # Devuelve la respuesta al frontend
        return JsonResponse({'result': result})