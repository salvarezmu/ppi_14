from rest_framework.decorators import api_view

from categories.models import Category
from categories.serializer import CategorySerializer
from categories.utils import map_transactions_from_categories
from core.constants import ApiConstants
from core.utils import ApiUtils
from tronapi.views import get_trm
from users.authentication import authenticate


@api_view(['POST'])
def categorize_transaction(request):
    """
    Categoriza una transacción y la guarda en la base de datos.

    Esta vista maneja una solicitud POST para categorizar una transacción y guardarla en la base de datos.

    Argumentos:
    - request (Request): Objeto de solicitud que contiene los datos de la transacción a categorizar.

    Retorna:
    - Response: Respuesta HTTP con el resultado de la operación de categorización y guardado de la transacción.
    """

    # Autentica al usuario utilizando un token en la solicitud
    _, decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    # Obtiene los datos de la transacción desde la solicitud
    tx_id = request.data.get('txId')
    value = request.data.get('value')
    timestamp = request.data.get('timestamp')
    from_address = request.data.get('fromAddress')
    to_address = request.data.get('toAddress')
    description = request.data.get('description')
    category = request.data.get('category')

    # Verifica si se proporcionaron todos los datos necesarios para la transacción
    if ((tx_id is None) or (value is None) or
            (timestamp is None) or (from_address is None) or
            (to_address is None) or (description is None) or
            (category is None)):
        return ApiUtils.build_bad_request_response()

    # Verifica si la transacción ya existe para el usuario
    if Category.objects.filter(tx_id=tx_id, user_id=decoded['user_id']).first():
        return ApiUtils.build_bad_request_response(ApiConstants.TRANSACTION_ALREADY_EXISTS_ERROR)

    # Crea una nueva instancia de Category con los datos proporcionados
    category = Category(
        user_id=decoded['user_id'],
        tx_id=tx_id,
        value=value,
        timestamp=timestamp,
        from_address=from_address,
        to_address=to_address,
        description=description,
        category=category,
    )

    # Guarda la instancia de Category en la base de datos
    category.save()

    # Serializa la transacción guardada para incluirla en la respuesta
    serialized = CategorySerializer(category).data
    return ApiUtils.build_generic_response({'transaction': serialized})


@api_view(["GET"])
def get_all(request):
    """
        Obtiene todas las categorías asociadas a un usuario autenticado.

        Esta vista maneja una solicitud GET para recuperar todas las categorías asociadas
        a un usuario autenticado utilizando su token de autenticación.

        Argumentos:
        - request (Request): Objeto de solicitud que contiene el token de autenticación.

        Retorna:
        - Response: Respuesta HTTP con las categorías asociadas al usuario.
    """

    # Autentica al usuario utilizando un token en la solicitud
    _, decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    # Obtiene todas las categorías asociadas al usuario autenticado
    categorized = Category.objects.filter(user_id=decoded['user_id'])
    mapped = map_transactions_from_categories(categorized)

    # Obtiene la tasa de cambio en USD para TRX
    trm = get_trm('TRX')
    mapped['USDValue'] = mapped['value'] * trm

    # Construye una respuesta HTTP con las categorías serializadas
    return ApiUtils.build_generic_response({'categories': mapped.values.tolist()})
