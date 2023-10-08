from rest_framework import viewsets
from django.http import JsonResponse
from .serializer import UserSerializer
from .models import User



class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
