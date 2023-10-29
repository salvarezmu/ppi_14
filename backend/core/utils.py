import datetime
import jwt
from django.http import JsonResponse
from rest_framework import status
from django.conf import settings

from .constants import ApiConstants


class ApiUtils:

    @staticmethod
    def build_generic_response(data) -> JsonResponse:
        """
        Construye una respuesta genérica en formato JSON.

        Esta función construye una respuesta JSON genérica con un indicador de \
        éxito ('status': True) y los datos proporcionados en el argumento 'data'. \
        La respuesta se crea con un estado HTTP de éxito (200 OK).

        Args:
            data (dict): Los datos que se incluirán en la respuesta. Debe ser un diccionario.

        Returns:
            JsonResponse: Una respuesta JSON genérica con los datos \
            proporcionados y un estado HTTP de éxito (200 OK).

        Note:
            Esta función se utiliza para construir respuestas JSON simples y \
            exitosas con datos personalizados.
        """

        return JsonResponse({'status': True, 'data': data}, safe=False, status=status.HTTP_200_OK)

    @staticmethod
    def build_bad_request_response(message=ApiConstants.BAD_REQUEST_ERROR.value) -> JsonResponse:
        """
        Construye una respuesta de solicitud incorrecta en formato JSON.

        Esta función construye una respuesta JSON que indica que la \
        solicitud es incorrecta o inválida. La respuesta contiene un \
        mensaje de error que puede ser personalizado o se utiliza el valor \
        predeterminado definido en la constante 'BAD_REQUEST_ERROR'. Además, \
        se establece un estado HTTP de solicitud incorrecta (400) en la respuesta.

        Args:
            message (str, opcional): Un mensaje de error personalizado. \
            Por defecto, se utiliza el mensaje definido en la constante 'BAD_REQUEST_ERROR'.

        Returns:
            JsonResponse: Una respuesta JSON que indica que la solicitud es incorrecta.

        Note:
            La constante 'BAD_REQUEST_ERROR' se utiliza como mensaje de \
            error por defecto en las respuestas de solicitud incorrecta.
        """

        return JsonResponse({'status': False, 'message': message}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def build_unauthorized_response() -> JsonResponse:
        """
        Construye una respuesta de no autorizado en formato JSON.

        Esta función construye una respuesta JSON que indica que la \
        solicitud no está autorizada. La respuesta contiene un mensaje \
        de error definido en la constante 'UNAUTHORIZED_ERROR' y un estado \
        HTTP de no autorizado (401).

        Returns:
            JsonResponse: Una respuesta JSON que indica que la solicitud no está autorizada.

        Note:
            La constante 'UNAUTHORIZED_ERROR' se utiliza para proporcionar un \
            mensaje de error estándar en las respuestas de no autorizado.
        """
        return JsonResponse({'status': False, 'message': ApiConstants.UNAUTHORIZED_ERROR.value}, safe=False,
                            status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def generate_access_token(user) -> str:
        """
        Genera un token de acceso JWT para un usuario.

        Esta función genera un token de acceso JWT (JSON Web Token) \
        para un usuario específico. El token contiene información
        como el ID de usuario, la fecha de expiración y la fecha de \
        emisión. El token se firma utilizando la clave secreta
        definida en la configuración (SECRET_KEY).

        Args:
            user: El objeto de usuario para el cual se genera el token de acceso.

        Returns:
            str: El token de acceso JWT generado como una cadena.

        Note:
            Esta función depende de la configuración de 'SECRET_KEY' y \
            utiliza la biblioteca 'jwt' para la generación del token.
        """

        # Configura la carga útil (payload) del token de acceso
        access_token_payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
        }

        # Genera el token de acceso JWT firmando la carga útil con la clave secreta y utilizando el algoritmo HS256
        access_token = jwt.encode(access_token_payload, settings.SECRET_KEY, algorithm='HS256')
        return access_token

