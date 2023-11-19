from rest_framework.decorators import api_view

from categories.models import Category
from categories.serializer import CategorySerializer
from core.constants import ApiConstants
from core.utils import ApiUtils
from users.authentication import authenticate


@api_view(['POST'])
def categorize_transaction(request):
    _, decoded = authenticate(request.GET.get('token'))
    if not decoded:
        return ApiUtils.build_unauthorized_response()

    tx_id = request.data.get('txId')
    value = request.data.get('value')
    timestamp = request.data.get('timestamp')
    from_address = request.data.get('fromAddress')
    to_address = request.data.get('toAddress')
    description = request.data.get('description')
    category = request.data.get('category')

    if ((tx_id is None) or (value is None) or
            (timestamp is None) or (from_address is None) or
            (to_address is None) or (description is None) or
            (category is None)):
        return ApiUtils.build_bad_request_response()

    if Category.objects.filter(tx_id=tx_id, user_id=decoded['user_id']).first():
        return ApiUtils.build_bad_request_response(ApiConstants.TRANSACTION_ALREADY_EXISTS_ERROR)

    category = Category(
        user_id=decoded['user_id'],
        tx_id=tx_id,
        value=value,
        timestamp=timestamp,
        from_address=from_address,
        to_address=to_address,
        description=description,
        category=category,
    )
    category.is_valid()
    category.save()

    serialized = CategorySerializer(category).data()
    return ApiUtils.build_generic_response({'transaction': serialized})
