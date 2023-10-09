import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

@csrf_exempt
@require_POST
def validate_address(request):
    # Obtiene la dirección TRON del cuerpo de la solicitud POST
    address = request.POST.get('address')

    # Verifica que se haya proporcionado una dirección
    if not address:
        return JsonResponse({'error': 'No se proporcionó una dirección TRON.'}, status=400)

    # Define la URL de la API de TRON
    api_url = 'https://api.shasta.trongrid.io/wallet/validateaddress'

    # Parámetros de la solicitud POST
    data = {'address': address}

    try:
        # Realiza la solicitud POST a la API de TRON
        response = requests.post(api_url, data=data)

        # Verifica si la solicitud fue exitosa
        if response.status_code == 200:
            result = response.json()
            return JsonResponse(result)
        else:
            # Si la solicitud no fue exitosa, devuelve un error
            return JsonResponse({'error': 'No se pudo validar la dirección TRON.'}, status=400)

    except requests.exceptions.RequestException as e:
        # Manejo de errores en caso de que la solicitud falle
        return JsonResponse({'error': f'Error al conectarse a la API de TRON: {str(e)}'}, status=500)

    # Devuelve una respuesta predeterminada en caso de un problema inesperado
    return JsonResponse({'error': 'Error interno del servidor.'}, status=500)