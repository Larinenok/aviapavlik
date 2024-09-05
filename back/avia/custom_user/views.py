from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.exceptions import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from .models import *
from .serializers import *


class APICustomUser(ListAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = CustomUser.objects.all()
    serializer_class = ListCustomUser


class APIChangeCustomUser(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = ChangeCustomUser

    @swagger_auto_schema(request_body=CreateCustomUser)
    def post(self, request, *args, **kwargs):
        serializer = CreateCustomUser(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Пользователь создан'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ChangeCustomUser)
    def put(self, request, *args, **kwargs):
        user = get_object_or_404(CustomUser, username=request.data.get('username'))
        serializer = ChangeCustomUser(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Пользователь изменен'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=DeleteCustomUser)
    def delete(self, request, *args, **kwargs):
        user = get_object_or_404(CustomUser, username=request.data.get('username'))
        serializer = DeleteCustomUser(user, data=request.data)
        if serializer.is_valid():
            serializer.delete(request.data)
            return Response({'message': 'Пользователь удален'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIRegisterCustomUser(GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    serializer_class = CreateCustomUser

    @swagger_auto_schema(request_body=CreateCustomUser)
    def post(self, request, *args, **kwargs):
        serializer = CreateCustomUser(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Пользователь создан'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIFindCustomUser(GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = CustomUser.objects.all()
    serializer_class = FindCustomUser

    @swagger_auto_schema(request_body=FindCustomUser)
    def post(self, request, *args, **kwargs):
        user = get_object_or_404(CustomUser, username=request.data.get('username'))
        serializer = self.get_serializer(user, data=request.data)
        if serializer.is_valid():
            user = CustomUser.objects.filter(username=request.data.get('username'))
            user = ListCustomUser(user, many=True).data

            return Response(user, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
