import hashlib
from rest_framework.decorators import api_view
from core.utils import ApiUtils
from core.constants import ApiConstants
from users.models import User
from tronapi.views import validate_address_util
from users.serializer import UserSerializer


@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')
    default_address = request.data.get('defaultAddress')

    if (email is None) or (password is None) or (default_address is None) or (username is None):
        return ApiUtils.build_bad_request_response()

    if User.objects.filter(email=email).first():
        return ApiUtils.build_bad_request_response(ApiConstants.USER_ALREADY_EXISTS_ERROR)

    if not validate_address_util(default_address):
        return ApiUtils.build_bad_request_response(ApiConstants.INVALID_ADDRESS_ERROR)

    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))
    user = User(email=email, username=username, password=hashed.hexdigest(), default_address=default_address)
    user.save()
    serialized = UserSerializer(user).data
    access_token = ApiUtils.generate_access_token(user)
    return ApiUtils.build_generic_response({'access_token': access_token, 'user': serialized})


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if (email is None) or (password is None):
        return ApiUtils.build_bad_request_response()

    user = User.objects.filter(email=email).first()

    if not user:
        return ApiUtils.build_bad_request_response(ApiConstants.USER_NOT_FOUND_ERROR)

    hashed = hashlib.sha256()
    hashed.update(password.encode('utf-8'))

    if hashed.hexdigest() != user.password:
        return ApiUtils.build_unauthorized_response()

    serialized = UserSerializer(user).data
    access_token = ApiUtils.generate_access_token(user)
    return ApiUtils.build_generic_response({'access_token': access_token, 'user': serialized})
