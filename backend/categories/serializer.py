from rest_framework import serializers

from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    """
       Serializador para el modelo Category.

       Este serializador convierte instancias del modelo Category a y desde JSON.

       Atributos:
       - model (Category): Modelo utilizado para serialización.
       - fields (list): Lista de campos del modelo a incluir en la serialización.
       """

    class Meta:
        model = Category
        fields = ["id", "user_id", "tx_id", "value", "date", "fromAddress", "toAddress"]
