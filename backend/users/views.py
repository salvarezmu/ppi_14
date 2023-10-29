import hashlib
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from core.utils import ApiUtils
from core.constants import ApiConstants
from users.models import User
from tronapi.views import validate_address_util
from users.serializer import UserSerializer


@api_view(['POST'])
def register(request):
    """
    Registra un nuevo usuario.

    Esta función toma los datos del usuario desde una solicitud\
    POST y realiza el registro del usuario en la base de datos.

    Args:
        request (HttpRequest): La solicitud HTTP que contiene\
        los datos del usuario.

    Returns:
        JsonResponse: Una respuesta JSON que contiene el resultado\
        del registro, incluido el token de acceso si es exitoso.

    Raises:
        BadRequestResponse: Si se producen errores en el registro,\
        como falta de datos, usuario ya existente o dirección no válida.
    """

    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')
    default_address = request.data.get('defaultAddress')

    # Comprobar si los datos obligatorios están presentes
    if (email is None) or (password is None) or (default_address is None) or (username is None):
        return ApiUtils.build_bad_request_response()

    # Comprobar si el usuario ya existe en la base de datos
    if User.objects.filter(email=email).first():
        return ApiUtils.build_bad_request_response(ApiConstants.USER_ALREADY_EXISTS_ERROR)

    # Validar la address predeterminada
    if not validate_address_util(default_address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)

    # Hashear la contraseña
    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))

    # Crear el usuario y guardarlo en la base de datos
    user = User(email=email, username=username, password=hashed.hexdigest(), default_address=default_address)
    user.save()

    # Serializar el usuario y generar un token de acceso
    serialized = UserSerializer(user).data
    access_token = ApiUtils.generate_access_token(user)

    # Construir una respuesta JSON exitosa
    return ApiUtils.build_generic_response({'access_token': access_token, 'user': serialized})


@api_view(['POST'])
def login(request):
    """
        Inicio de sesión de un usuario.

        Esta función maneja el proceso de inicio de sesión\
        de un usuario utilizando un correo electrónico y una contraseña.

        Args:
            request (HttpRequest): La solicitud HTTP que contiene\
            los datos de inicio de sesión del usuario.

        Returns:
            JsonResponse: Una respuesta JSON que contiene el resultado\
            del inicio de sesión, incluido el token de acceso si es exitoso.

        Raises:
            BadRequestResponse: Si se producen errores en el proceso de\
            inicio de sesión, como datos faltantes, usuario no encontrado\
            o contraseña incorrecta.
            UnauthorizedResponse: Si la contraseña proporcionada no coincide\
            con la almacenada en la base de datos.
    """

    email = request.data.get('email')
    password = request.data.get('password')

    # Comprobar si los datos obligatorios están presentes
    if (email is None) or (password is None):
        return ApiUtils.build_bad_request_response()

    # Buscar el usuario en la base de datos
    user = User.objects.filter(email=email).first()

    # Comprobar si el usuario existe
    if not user:
        return ApiUtils.build_bad_request_response(ApiConstants.USER_NOT_FOUND_ERROR)

    # Hashear la contraseña proporcionada y compararla con la almacenada
    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))

    # Serializar el usuario y generar un token de acceso
    if hashed.hexdigest() != user.password:
        return ApiUtils.build_unauthorized_response()

    # Construir una respuesta JSON exitosa
    serialized = UserSerializer(user).data
    access_token = ApiUtils.generate_access_token(user)
    return ApiUtils.build_generic_response({'access_token': access_token, 'user': serialized})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """
    Vista para eliminar la cuenta de usuario.

    Esta vista permite a los usuarios autenticados eliminar su cuenta de usuario.

    Args:
        request (HttpRequest): La solicitud HTTP que contiene los datos del usuario autenticado.

    Returns:
        Response: Una respuesta JSON que indica si la eliminación de la cuenta fue exitosa.

    Raises:
        PermissionDenied: Si el usuario no está autenticado, no se permite el acceso a esta vista.
    """
    user = request.user  # El usuario autenticado que realiza la solicitud
    user.delete()  # Elimina la cuenta del usuario
    return Response({'message': 'Cuenta eliminada con éxito.'}, status=status.HTTP_204_NO_CONTENT)