from django.db import models


class FlightInfo(models.Model):
    flight_id = models.CharField(default='==> not specified <==', max_length=64, unique=True, verbose_name='Идентификатор рейса')
    place_of_departure = models.CharField(default='', max_length=100, verbose_name='Место отправления')
    place_of_arrival = models.CharField(default='', max_length=100, verbose_name='Место прибытия')
    airline_name = models.CharField(max_length=100, verbose_name='Название авиакомпании')
    number_of_passengers = models.PositiveIntegerField(verbose_name='Количество пассажиров')
    departure_date = models.DateTimeField(verbose_name='Дата вылета')

    def __str__(self):
        return f'{str(self.place_of_departure)}:{str(self.place_of_arrival)}:{str(self.airline_name)}:{str(self.departure_date)}'

    class Meta:
        verbose_name = 'Информация о рейсе'
        verbose_name_plural = 'Информация о рейсе'
