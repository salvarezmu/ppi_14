import json
from django.views.decorators.http import require_http_methods


@require_http_methods(['POST'])
def register(request):
    body = json.loads(request.body)
    print(body)
