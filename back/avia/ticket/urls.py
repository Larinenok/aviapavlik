from django.urls import path

from .views import *


urlpatterns = [
    path('list/', APITicketInfo.as_view(), name='list_ticket_info'),
    path('change/', APIChangeTicketInfo.as_view(), name='change_ticket_info'),
    path('find/', APIFindTicketInfo.as_view(), name='find_ticket_info'),
]
