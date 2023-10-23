from djongo import models


class User(models.Model):
    username = models.TextField()
    email = models.TextField(unique=True)
    password = models.CharField(max_length=64)
    default_address = models.TextField()
