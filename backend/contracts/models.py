from djongo import models


class Contract(models.Model):
    """
    Modelo que representa un contrato de TRC20.

    Atributos:
    - user_id (TextField): ID del usuario asociado con el contrato.
    - address (TextField): Dirección relacionada con el contrato.
    - name (TextField): Nombre asociado con el contrato.
    """

    user_id = models.IntegerField()
    address = models.TextField()
    name = models.TextField()
