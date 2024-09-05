from django.db import models
from custom_user.models import *
from flight.models import *


class TicketInfo(models.Model):
    ticket_id = models.CharField(default='==> not specified <==', max_length=64, unique=True, verbose_name='Идентификатор билета')
    user = models.CharField(default='', max_length=150, verbose_name='Имя пользователя')
    flight = models.CharField(default='', max_length=64, verbose_name='Идентификатор рейса')

    def __str__(self):
        return f'{str(self.user)}:{str(self.flight)}'

    class Meta:
        verbose_name = 'Информация о билете'
        verbose_name_plural = 'Информация о билете'
