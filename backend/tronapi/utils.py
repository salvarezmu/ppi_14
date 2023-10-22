import pandas as pd
import base58


class TronApiUtils:

    @staticmethod
    def hex_address_to_base58(addresses: [str]) -> [str]:
        return [base58.b58encode_check(bytes.fromhex(a)).decode('utf-8') for a in addresses]

    @staticmethod
    def map_get_trx_transactions_response(data):
        mapped = []
        for transaction in data:
            contract_info = transaction['raw_data']['contract'][0]
            if contract_info['type'] == "TransferContract":
                mapped.append([
                    transaction['txID'],
                    int(contract_info['parameter']['value']['amount']),
                    int(transaction['raw_data']['timestamp']),
                    contract_info['parameter']['value']['owner_address'],
                    contract_info['parameter']['value']['to_address'],
                    'TRX',
                ])
        return pd.DataFrame(data=mapped, columns=['txID', 'amount', 'timestamp', 'from', 'to', 'symbol'])
