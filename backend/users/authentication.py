import jwt
from django.conf import settings


def authenticate(jwt_token):
    """
    Autenticación de usuario a través de un token JWT.

    Esta función verifica la validez de un token JWT\
    utilizando la clave secreta definida en la configuración de Django.

    Args:
        jwt_token (str): El token JWT que se debe autenticar.

    Returns:
        bool: True si el token JWT es válido, False si no lo es.

    Note:
        El token JWT debe ser válido y estar firmado con la misma\
        clave secreta definida en la configuración de Django (settings.SECRET_KEY).
    """

    if jwt_token is None:
        return False
    try:
        # Intenta descodificar el token JWT utilizando la clave secreta
        jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
    except:
        # Si hay una excepción, el token no es válido
        return False
    return True
