from djongo import models


class Category(models.Model):
    """
       Modelo que representa una categoría de transacciones.

       Atributos:
       - user_id (IntegerField): ID del usuario asociado a la categoría.
       - tx_id (TextField): ID de la transacción.
       - value (IntegerField): Valor de la transacción.
       - date (DateField): Fecha de la transacción.
       - from_address (TextField): Dirección del remitente de la transacción.
       - to_address (TextField): Dirección del destinatario de la transacción.
       """

    user_id = models.IntegerField()
    tx_id = models.TextField()
    value = models.IntegerField()
    timestamp = models.IntegerField()
    from_address = models.TextField()
    to_address = models.TextField()
    description = models.TextField()
    category = models.TextField()

