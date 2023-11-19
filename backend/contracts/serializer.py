from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Contract.

    Este serializador convierte instancias del modelo Contract a y desde JSON.

    Atributos:
    - model (Contract): Modelo utilizado para serialización.
    - fields (list): Lista de campos del modelo a incluir en la serialización.
    """

    class Meta:
        model = Contract
        fields = ["id", "user_id", "address", "name"]
