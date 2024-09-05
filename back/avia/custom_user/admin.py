from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


admin.site.register(CustomUser)

class CustomUserAdmin(UserAdmin):
    list_display = ['first_name', 'last_name']
    list_display_links = ['first_name', 'last_name']
