import os

import requests
import numpy as np
from rest_framework.decorators import api_view

from users.authentication import authenticate
from .constants import TronApiConstants
from .utils import TronApiUtils
from core.utils import ApiUtils


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
    url = TronApiConstants.GET_TRANSACTIONS_URL.value.replace(TronApiConstants.REPLACE_ADDRESS_PARAM.value, address)
    params = {}

    if req.GET.get('startTimestamp'):
        params['min_timestamp'] = req.GET.get('startTimestamp')

    if req.GET.get('finalTimestamp'):
        params['max_timestamp'] = req.GET.get('finalTimestamp')

    transactions = []
    statistics = {
        'average': 0,
        'med': 0,
        'maximum': 0,
        'minimum': 0,
        'sum': 0,
    }

    raw_response = requests.get(url, params=params).json()['data']
    if raw_response:
        data = TronApiUtils.map_get_trx_transactions_response(raw_response)
        data['amount'] = data['amount'] / TronApiConstants.SUN_TO_TRX.value
        data['from'] = TronApiUtils.hex_address_to_base58(data['from'])
        data['to'] = TronApiUtils.hex_address_to_base58(data['to'])
        data['type'] = np.where(data['to'] == address, 'Entrada', 'Salida')

        inputs = data.loc[data['type'] == 'Entrada', 'amount'].sum()
        outputs = data.loc[data['type'] == 'Salida', 'amount'].sum()

        statistics['average'] = data['amount'].mean()
        statistics['med'] = data['amount'].median()
        statistics['maximum'] = data['amount'].max()
        statistics['minimum'] = data['amount'].min()
        statistics['sum'] = inputs - outputs

        if req.GET.get('requiresUSD') == 'true':
            if not authenticate(req.GET.get('token')):
                return ApiUtils.build_unauthorized_response()
            trm = get_trm('TRX')
            data['USDAmount'] = data['amount'] * trm
        transactions = data.values.tolist()
    return ApiUtils.build_generic_response({'transactions': transactions, 'statistics': statistics})


@api_view(["GET"])
def get_history_blocks(req, quantity: int):
    url = TronApiConstants.GET_BLOCK_HISTORY_URL.value
    params = {'num': quantity}
    raw_data = requests.get(url, params=params).json()
    blocks = []
    try:
        data = TronApiUtils.map_get_block_history_response(raw_data['block'])
        blocks = data.values.tolist()[::-1]
    except:
        pass
    return ApiUtils.build_generic_response({'blocks': blocks})


@api_view(["GET"])
def get_block_transactions(req, block: int):
    url = TronApiConstants.GET_BLOCK_TRANSACTIONS_URL.value
    params = {'num': block}
    raw_data = requests.get(url, params=params).json()
    data = TronApiUtils.map_get_block_transactions(raw_data)
    data['minerFee'] = data['minerFee'] / TronApiConstants.SUN_TO_TRX.value

    if req.GET.get('requiresUSD') == 'true':
        if not authenticate(req.GET.get('token')):
            return ApiUtils.build_unauthorized_response()
        trm = get_trm('TRX')
        data['USDMinerFee'] = data['minerFee'] * trm

    return ApiUtils.build_generic_response({'transactions': data.values.tolist()})
