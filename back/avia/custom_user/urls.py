from django.urls import path

from .views import *


urlpatterns = [
    path('list/', APICustomUser.as_view(), name='list_custom_user_info'),
    path('change/', APIChangeCustomUser.as_view(), name='change_custom_user_info'),
    path('find/', APIFindCustomUser.as_view(), name='find_custom_user_info'),
    path('register/', APIRegisterCustomUser.as_view(), name='find_custom_user_info'),
]
