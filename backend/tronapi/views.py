import requests
import numpy as np
from django.views.decorators.http import require_http_methods

from .constants import TronApiConstants
from .utils import TronApiUtils
from core.utils import ApiUtils
from core.constants import ApiConstants


def validate_address_util(address) -> bool:
    service_response = requests.post(TronApiConstants.VALIDATE_ADDRESS_URL.value, json={'address': address})
    return service_response.json()['result']


@require_http_methods(["GET"])
def validate_address(req, address):
    return ApiUtils.build_generic_response({'isValid': validate_address_util(address)})


@require_http_methods(["GET"])
def get_trx_balance(req, address):
    if not validate_address_util(address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)
    
    url = TronApiConstants.GET_BALANCE_URL.value.replace(TronApiConstants.REPLACE_ADDRESS_PARAM.value, address)
    raw_data = requests.get(url).json()['data']
    raw_balance = raw_data[0]['balance']
    balance = raw_balance / TronApiConstants.SUN_TO_TRX.value
    return ApiUtils.build_generic_response({'balance': balance})


@require_http_methods(["GET"])
def get_trx_transactions(req, address):
    if not validate_address_util(address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)

    url = TronApiConstants.GET_TRANSACTIONS_URL.value.replace(TronApiConstants.REPLACE_ADDRESS_PARAM.value, address)
    data = TronApiUtils.map_get_trx_transactions_response(requests.get(url).json()['data'])
    data['amount'] = data['amount'] / TronApiConstants.SUN_TO_TRX.value
    data['from'] = TronApiUtils.hex_address_to_base58(data['from'])
    data['to'] = TronApiUtils.hex_address_to_base58(data['to'])
    data['type'] = np.where(data['to'] == address, 'INPUT', 'OUTPUT')
    return ApiUtils.build_generic_response(data.values.tolist())
