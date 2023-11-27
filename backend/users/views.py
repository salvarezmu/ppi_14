import hashlib
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.utils import ApiUtils
from core.constants import ApiConstants
from users.models import User
from tronapi.views import validate_address_util
from users.serializer import UserSerializer
from .authentication import authenticate


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

    # Comprobar si los datos obligatorios están presentes
    if (email is None) or (password is None) or (username is None):
        return ApiUtils.build_bad_request_response()

    # Comprobar si el usuario ya existe en la base de datos
    if User.objects.filter(email=email).first():
        return ApiUtils.build_bad_request_response(ApiConstants.USER_ALREADY_EXISTS_ERROR)

    # Hashear la contraseña
    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))

    # Crear el usuario y guardarlo en la base de datos
    user = User(email=email, username=username, password=hashed.hexdigest())
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
    # Verifica la autenticación del token
    decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    # El usuario autenticado que realiza la solicitud
    user = User.objects.filter(id=decoded[1]['user_id']).first()

    # Elimina la cuenta del usuario
    user.delete()
    return ApiUtils.build_generic_response({'message': 'Cuenta eliminada con éxito.'})


@api_view(['PATCH'])
def update_user(request):
    """
    Actualiza la información de un usuario.

    Parameters:
    - request: La solicitud HTTP que contiene los datos para actualizar el usuario.

    Returns:
    - JsonResponse: Una respuesta JSON que indica el resultado de la actualización.
                    Contiene un mensaje y los datos actualizados del usuario si tiene éxito.
    """

    # Autenticar el token recibido en la solicitud
    decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    # Obtener el nombre de usuario proporcionado en los datos de la solicitud
    username = request.data.get('username')
    # Verificar si no se proporcionó un nombre de usuario
    if not username:
        return ApiUtils.build_bad_request_response(ApiConstants.BAD_REQUEST_ERROR)

    # Buscar al usuario en la base de datos utilizando el ID extraído del token decodificado
    user = User.objects.filter(id=decoded[1]['user_id']).first()

    # Actualizar el nombre de usuario del usuario encontrado
    user.username = username
    user.save()

    # Serializar los datos actualizados del usuario
    serialized = UserSerializer(user).data
    return ApiUtils.build_generic_response({'message': 'Cuenta actualizada.', 'user': serialized})


@api_view(["PATCH"])
def update_password(request):
    """
    Actualiza la contraseña de un usuario.

    Parameters:
    - request: La solicitud HTTP que contiene los datos necesarios para actualizar la contraseña.

    Returns:
    - JsonResponse: Una respuesta JSON que indica el resultado de la actualización de la contraseña.
                    Contiene un mensaje que informa sobre el éxito o fracaso de la operación.
    """

    # Autenticar el token recibido en la solicitud
    decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    # Obtener la contraseña actual y la nueva contraseña proporcionadas en los datos de la solicitud
    password = request.data.get('password')
    new_password = request.data.get('newPassword')

    # Verificar si no se proporcionaron ambas contraseñas
    if (not password) or (not new_password):
        return ApiUtils.build_bad_request_response(ApiConstants.BAD_REQUEST_ERROR)

    # Buscar al usuario en la base de datos utilizando el ID extraído del token decodificado
    user = User.objects.filter(id=decoded[1]['user_id']).first()

    # Verificar si la contraseña proporcionada coincide con la contraseña almacenada del usuario
    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))

    if hashed.hexdigest() != user.password:
        return ApiUtils.build_unauthorized_response()

    # Crear un hash de la nueva contraseña y actualizarla en el usuario
    new_hashed = hashlib.sha256()
    new_hashed.update(new_password.encode('utf-8'))
    user.password = new_hashed.hexdigest()
    user.save()

    # Devolver una respuesta exitosa indicando que la contraseña se actualizó correctamente
    return ApiUtils.build_generic_response({'message': 'Contraseña actualizada.'})
