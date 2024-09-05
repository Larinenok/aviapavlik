from django.urls import path

from .views import *


urlpatterns = [
    path('list/', APIFlightInfo.as_view(), name='list_flight_info'),
    path('change/', APIChangeFlightInfo.as_view(), name='change_flight_info'),
    path('find/', APIFindFlightInfo.as_view(), name='find_flight_info'),
]
