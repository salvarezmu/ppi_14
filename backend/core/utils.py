import datetime
import jwt
from django.http import JsonResponse
from rest_framework import status
from django.conf import settings

from .constants import ApiConstants


class ApiUtils:

    @staticmethod
    def build_generic_response(data) -> JsonResponse:
        return JsonResponse({'status': True, 'data': data}, safe=False, status=status.HTTP_200_OK)

    @staticmethod
    def build_bad_request_response(message=ApiConstants.BAD_REQUEST_ERROR.value) -> JsonResponse:
        return JsonResponse({'status': False, 'message': message}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def build_unauthorized_response() -> JsonResponse:
        return JsonResponse({'status': False, 'message': ApiConstants.UNAUTHORIZED_ERROR.value}, safe=False,
                            status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def generate_access_token(user) -> str:
        access_token_payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
        }
        access_token = jwt.encode(access_token_payload, settings.SECRET_KEY, algorithm='HS256')
        return access_token

    @staticmethod
    def validate_access_token(jwt_token) -> (bool, JsonResponse | None):
        try:
            jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            return False, ApiUtils.build_unauthorized_response()

        return True
