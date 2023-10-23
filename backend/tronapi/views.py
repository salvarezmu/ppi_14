import os

import requests
import numpy as np
from rest_framework.decorators import api_view

from users.authentication import authenticate
from .constants import TronApiConstants
from .utils import TronApiUtils
from core.utils import ApiUtils
from core.constants import ApiConstants


def validate_address_util(address) -> bool:
    service_response = requests.post(TronApiConstants.VALIDATE_ADDRESS_URL.value, json={'address': address})
    return service_response.json()['result']


def get_trx_balance_util(address) -> int:
    url = TronApiConstants.GET_BALANCE_URL.value.replace(TronApiConstants.REPLACE_ADDRESS_PARAM.value, address)
    raw_data = requests.get(url).json()['data']
    raw_balance = raw_data[0]['balance']
    balance = raw_balance / TronApiConstants.SUN_TO_TRX.value
    return balance


def get_trm(symbol: str) -> int:
    url = TronApiConstants.GET_BALANCE_URL.GET_TRM_URL.value
    params = {
        'CMC_PRO_API_KEY': os.getenv('COINMARKET_API_KEY'),
        'symbol': symbol,
        'convert': 'USD',
    }
    raw_data = requests.get(url, params=params).json()
    return raw_data['data'][symbol]['quote']['USD']['price']


@api_view(["GET"])
def validate_address(req, address):
    return ApiUtils.build_generic_response({'isValid': validate_address_util(address)})


@api_view(["GET"])
def get_trx_balance(req, address):
    if not validate_address_util(address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)
    balance = get_trx_balance_util(address)
    response = {'balance': balance}
    if req.GET.get('requiresUSD') == 'true':
        if not authenticate(req.GET.get('token')):
            return ApiUtils.build_unauthorized_response()
        trm = get_trm('TRX')
        usd_balance = balance * trm
        response['USDBalance'] = usd_balance
    return ApiUtils.build_generic_response(response)


@api_view(["GET"])
def get_trx_transactions(req, address):
    if not validate_address_util(address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)

    url = TronApiConstants.GET_TRANSACTIONS_URL.value.replace(TronApiConstants.REPLACE_ADDRESS_PARAM.value, address)
    data = TronApiUtils.map_get_trx_transactions_response(requests.get(url).json()['data'])
    data['amount'] = data['amount'] / TronApiConstants.SUN_TO_TRX.value
    data['from'] = TronApiUtils.hex_address_to_base58(data['from'])
    data['to'] = TronApiUtils.hex_address_to_base58(data['to'])
    data['type'] = np.where(data['to'] == address, 'Entrada', 'Salida')

    if req.GET.get('requiresUSD') == 'true':
        if not authenticate(req.GET.get('token')):
            return ApiUtils.build_unauthorized_response()
        trm = get_trm('TRX')
        data['USDAmount'] = data['amount'] * trm
    return ApiUtils.build_generic_response(data.values.tolist())
