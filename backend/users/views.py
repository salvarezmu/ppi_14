from rest_framework import viewsets
from .serializer import UserSerializer
from .models import User


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
