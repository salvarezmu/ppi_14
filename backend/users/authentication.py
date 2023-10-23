import jwt
from django.conf import settings


def authenticate(jwt_token):
    if jwt_token is None:
        return False
    try:
        jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
    except:
        return False
    return True
