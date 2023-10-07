from djongo import models


class User(models.Model):
    name = models.TextField()
    email = models.TextField()
    password = models.CharField(max_length=64)
