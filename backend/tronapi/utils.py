import pandas as pd
import base58


class TronApiUtils:

    @staticmethod
    def hex_address_to_base58(addresses: [str]) -> [str]:
        """
        Convierte una lista de direcciones en formato hexadecimal a formato Base58.

        Esta función toma una lista de direcciones en formato hexadecimal y las convierte a formato Base58.
        La conversión a Base58 es común en criptomonedas para representar direcciones legibles por humanos.

        Args:
            addresses ([str]): Una lista de direcciones en formato hexadecimal que se desean convertir.

        Returns:
            [str]: Una lista de direcciones convertidas a formato Base58.

        Note:
            Esta función asume que las direcciones en formato hexadecimal son válidas y pueden convertirse a Base58.
        """

        # Utiliza una comprensión de lista para convertir cada dirección en formato hexadecimal a Base58
        return [base58.b58encode_check(bytes.fromhex(a)).decode('utf-8') for a in addresses]

    @staticmethod
    def map_get_trx_transactions_response(data):
        """
        Mapea y procesa la respuesta de transacciones de TRX de la API de Tron.

        Esta función toma la respuesta de transacciones de la API de Tron\
        y extrae información relevante para su posterior uso.
        Solo se mapean las transacciones de tipo "TransferContract", que son transacciones de TRX.

        Args:
            data (list): La respuesta de la API que contiene datos de transacciones de TRX.

        Returns:
            pd.DataFrame: Un DataFrame que contiene datos mapeados de las transacciones, con columnas 'txID', 'amount',
                         'timestamp', 'from', 'to', y 'symbol'.

        Note:
            Esta función asume que la respuesta contiene datos válidos y que las\
            transacciones de tipo "TransferContract" son las únicas de interés.
        """

        mapped = []

        # Itera a través de las transacciones en la respuesta
        for transaction in data:
            contract_info = transaction['raw_data']['contract'][0]

            # Verifica si la transacción es de tipo "TransferContract" (Transacción de TRX)
            if contract_info['type'] == "TransferContract":
                mapped.append([
                    transaction['txID'],
                    int(contract_info['parameter']['value']['amount']),
                    int(transaction['raw_data']['timestamp']),
                    contract_info['parameter']['value']['owner_address'],
                    contract_info['parameter']['value']['to_address'],
                    'TRX',
                ])

        # Crea un DataFrame a partir de los datos mapeados
        return pd.DataFrame(data=mapped, columns=['txID', 'amount', 'timestamp', 'from', 'to', 'symbol'])

    @staticmethod
    def map_get_block_history_response(blocks):
        """
        Mapea y procesa la respuesta de la historia de bloques de la red Tron.

        Esta función toma la respuesta que contiene información sobre bloques\
        de la red Tron y extrae datos relevantes para su posterior uso.
        Se mapea información como el ID del bloque, el número de bloque, la\
        marca de tiempo y la cantidad de transacciones en el bloque.

        Args:
            blocks (list): La respuesta que contiene datos de la historia de bloques de la red Tron.

        Returns:
            pd.DataFrame: Un DataFrame que contiene datos mapeados de la \
            historia de bloques, con columnas 'blockID', 'number',
                         'timestamp' y 'transactions_number'.

        Note:
            Esta función asume que la respuesta contiene datos válidos y\
            maneja los casos en los que no hay transacciones en un bloque.
        """

        mapped = []

        # Itera a través de los bloques en la respuesta
        for block in blocks:
            raw_data = block['block_header']['raw_data']

            # Inicializa la cantidad de transacciones como 0 y maneja el caso en el que no hay transacciones
            quantity = 0
            try:
                quantity = len(block['transactions'])
            except:
                pass

            mapped.append([
                block['blockID'],
                raw_data['number'],
                raw_data['timestamp'],
                quantity,
            ])

        # Crea un DataFrame a partir de los datos mapeados
        return pd.DataFrame(data=mapped, columns=['blockID', 'number', 'timestamp', 'transactions_number'])

    @staticmethod
    def map_get_block_transactions(data):
        """
        Mapea y procesa la respuesta de las transacciones de un bloque en la red Tron.

        Esta función toma la respuesta que contiene información sobre las transacciones\
        de un bloque en la red Tron y extrae datos relevantes para su posterior uso.
        Se mapea información como el ID de la transacción, la tarifa de la transacción\
        y la marca de tiempo del bloque.

        Args:
            data (list): La respuesta que contiene datos de las transacciones de un bloque.

        Returns:
            pd.DataFrame: Un DataFrame que contiene datos mapeados de las\
            transacciones de un bloque, con columnas 'txID', 'minerFee'
                         y 'timestamp'.

        Note:
            Esta función asume que la respuesta contiene datos válidos y\
            que se están mapeando las transacciones de un bloque específico.
        """

        mapped = []

        # Itera a través de las transacciones en la respuesta
        for transaction in data:
            mapped.append([
                transaction['id'],
                transaction['fee'],
                transaction['blockTimeStamp']
            ])

        # Crea un DataFrame a partir de los datos mapeados
        return pd.DataFrame(data=mapped, columns=['txID', 'minerFee', 'timestamp'])
