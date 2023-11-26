from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo User.

    Esta clase se utiliza para serializar objetos\
    de tipo User a formato JSON y viceversa.
    Define qué campos del modelo User se deben incluir\
    en la representación serializada.
    """

    class Meta:
        model = User
        fields = ['id', 'username', 'email']
