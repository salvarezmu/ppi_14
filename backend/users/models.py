from djongo import models


class User(models.Model):
    """
    Modelo para representar usuarios en la base de datos.

    Este modelo almacena información sobre los usuarios,\
    incluyendo su nombre de usuario, correo electrónico,
    contraseña y dirección predeterminada.

    Attributes:
        username (TextField): El nombre de usuario del usuario.
        email (TextField, unique=True): El correo electrónico del usuario (debe ser único).
        password (CharField): La contraseña del usuario, con un límite de 64 caracteres.
    """

    username = models.TextField()
    email = models.TextField(unique=True)
    password = models.CharField(max_length=64)
