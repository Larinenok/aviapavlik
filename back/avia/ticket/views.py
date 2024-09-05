from rest_framework.exceptions import status
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework import permissions
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *


class APITicketInfo(ListAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = TicketInfo.objects.all()
    serializer_class = ListTicketInfo


class APIChangeTicketInfo(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = ChangeTicketInfo

    @swagger_auto_schema(request_body=CreateTicketInfo)
    def post(self, request, *args, **kwargs):
        serializer = CreateTicketInfo(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Билет создан'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ChangeTicketInfo)
    def put(self, request, *args, **kwargs):
        ticket = get_object_or_404(TicketInfo, ticket_id=request.data.get('ticket_id'))
        serializer = self.get_serializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Билет изменен'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=DeleteTicketInfo)
    def delete(self, request, *args, **kwargs):
        ticket = get_object_or_404(TicketInfo, ticket_id=request.data.get('ticket_id'))
        serializer = DeleteTicketInfo(ticket, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.delete(request.data)
            return Response({'message': 'Билет удален'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIFindTicketInfo(GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    queryset = TicketInfo.objects.all()
    serializer_class = FindTicketInfo

    @swagger_auto_schema(request_body=FindTicketInfo)
    def post(self, request, *args, **kwargs):
        ticket = get_object_or_404(TicketInfo, ticket_id=request.data.get('ticket_id'))
        serializer = self.get_serializer(ticket, data=request.data)
        if serializer.is_valid():
            ticket = TicketInfo.objects.filter(ticket_id=request.data.get('ticket_id'))
            ticket = ListTicketInfo(ticket, many=True).data

            return Response(ticket, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
