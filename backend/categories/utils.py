import pandas as pd

from categories.models import Category


def map_transactions_from_categories(categories):
    mapped = []

    for transaction in categories:
        mapped.append([
            transaction.tx_id,
            float(transaction.value),
            transaction.category,
            transaction.description,
            transaction.from_address,
            transaction.to_address,
            transaction.timestamp,
        ])

    return pd.DataFrame(data=mapped, columns=['txID', 'value', 'category', 'description', 'from', 'to', 'timestamp'])
