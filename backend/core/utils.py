from django.http import JsonResponse
from rest_framework import status

from .constants import ApiConstants


class ApiUtils:

    @staticmethod
    def build_generic_response(data) -> JsonResponse:
        return JsonResponse({'status': True, 'data': data}, safe=False, status=status.HTTP_200_OK)

    @staticmethod
    def build_bad_request_response(message=ApiConstants.BAD_REQUEST_ERROR.value) -> JsonResponse:
        return JsonResponse({'status': False, 'message': message}, safe=False, status=status.HTTP_400_BAD_REQUEST)
