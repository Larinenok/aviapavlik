from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    first_name = models.CharField(default='==> not specified <==', max_length=20, verbose_name='Имя')
    last_name = models.CharField(default='==> not specified <==', max_length=20, verbose_name='Фамилия')
    patronymic = models.CharField(default='==> not specified <==', blank=True, max_length=20, verbose_name='Отчество')

    def __str__(self):
        return self.username
