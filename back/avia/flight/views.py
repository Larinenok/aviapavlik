from rest_framework.exceptions import status
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework import permissions
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *


class APIFlightInfo(ListAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = FlightInfo.objects.all()
    serializer_class = ListFlightInfo


class APIChangeFlightInfo(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = ChangeFlightInfo

    @swagger_auto_schema(request_body=CreateFlightInfo)
    def post(self, request, *args, **kwargs):
        serializer = CreateFlightInfo(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Рейс создан'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ChangeFlightInfo)
    def put(self, request, *args, **kwargs):
        flight = get_object_or_404(FlightInfo, flight_id=request.data.get('flight_id'))
        serializer = self.get_serializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Рейс изменен'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=DeleteFlightInfo)
    def delete(self, request, *args, **kwargs):
        flight = get_object_or_404(FlightInfo, flight_id=request.data.get('flight_id'))
        serializer = DeleteFlightInfo(flight, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.delete(request.data)
            return Response({'message': 'Рейс удален'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIFindFlightInfo(GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = FlightInfo.objects.all()
    serializer_class = FindFlightInfo

    @swagger_auto_schema(request_body=FindFlightInfo)
    def post(self, request, *args, **kwargs):
        flight = get_object_or_404(FlightInfo, flight_id=request.data.get('flight_id'))
        serializer = self.get_serializer(flight, data=request.data)
        if serializer.is_valid():
            flight = FlightInfo.objects.filter(flight_id=request.data.get('flight_id'))
            flight = ListFlightInfo(flight, many=True).data

            return Response(flight, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
