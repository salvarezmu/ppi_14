from rest_framework.decorators import api_view

from contracts.models import Contract
from contracts.serializer import ContractSerializer
from core.constants import ApiConstants
from core.utils import ApiUtils
from tronapi.views import validate_contract_util
from users.authentication import authenticate


@api_view(["POST"])
def save_contract(request):
    """
        Guarda un contrato en la base de datos.

        Esta vista maneja una solicitud POST para guardar un contrato en la base de datos.
        Verifica la autenticidad del usuario, la validez de los datos y si el contrato ya existe.

        Argumentos:
        - request (Request): Objeto de solicitud que contiene los datos del contrato a guardar.

        Retorna:
        - Response: Respuesta HTTP con el resultado de la operación de guardado del contrato.
        """

    # Autentica al usuario utilizando un token en la solicitud
    _, decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    address = request.data.get('address')
    name = request.data.get('name')

    # Verifica si se proporcionaron datos de dirección y nombre del contrato
    if (address is None) or (name is None):
        return ApiUtils.build_bad_request_response()

    # Verifica si ya existe un contrato con la misma dirección para el mismo usuario
    if Contract.objects.filter(address=address, user_id=decoded['user_id']).first():
        return ApiUtils.build_bad_request_response(ApiConstants.CONTRACT_ALREADY_EXISTS_ERROR)

    # Valida si la dirección proporcionada es un contrato válido
    if not validate_contract_util(address):
        return ApiUtils.build_bad_request_response(ApiConstants.ADDRESS_IS_NOT_A_CONTRACT)

    # Guarda el contrato en la base de datos
    contract = Contract(user_id=decoded['user_id'], address=address, name=name)
    contract.save()

    # Serializa el contrato guardado para incluirlo en la respuesta
    serialized = ContractSerializer(contract).data
    return ApiUtils.build_generic_response({'contract': serialized})
