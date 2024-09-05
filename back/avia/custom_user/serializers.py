from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

from .models import *


User = get_user_model()


class ListCustomUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'patronymic', 'is_staff']


class ChangeCustomUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'patronymic']

    def validate(self, attrs):
        if not CustomUser.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Такого пользователя не существует'})

        return attrs


class CreateCustomUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'patronymic']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            patronymic=validated_data['patronymic']
        )
        return user


class DeleteCustomUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

    def validate(self, attrs):
        if not User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Такого пользователя не существует'})

        return attrs

    def delete(self, validated_data):
        custom_user = User.objects.filter(username=validated_data.get('username'))
        if custom_user.exists():
            custom_user[0].delete()
            return []
        raise serializers.ValidationError({'username': 'Такого пользователя не существует'})


class FindCustomUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

    def validate(self, attrs):
        if not User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Такого пользователя не существует'})

        return attrs


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data['username'] = user.username

        return data
