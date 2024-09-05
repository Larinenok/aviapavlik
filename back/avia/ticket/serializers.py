from rest_framework import serializers
import hashlib

from .models import *


class ListTicketInfo(serializers.ModelSerializer):
    class Meta:
        model = TicketInfo
        fields = ['ticket_id', 'user', 'flight']


def get_hash(validated_data):
    return hashlib.sha256(f'{validated_data.get("user")}{validated_data.get("flight")}'.encode()).hexdigest()


class ChangeTicketInfo(serializers.ModelSerializer):
    class Meta:
        model = TicketInfo
        fields = ['ticket_id', 'user', 'flight']

    def validate(self, attrs):
        if not TicketInfo.objects.filter(ticket_id=attrs['ticket_id']).exists():
            raise serializers.ValidationError({'ticket_id': 'Такого билета не существует'})

        if not CustomUser.objects.filter(username=attrs['user']).exists():
            raise serializers.ValidationError({'user': 'Такого пользователя не существует'})

        if not FlightInfo.objects.filter(flight_id=attrs['flight']).exists():
            raise serializers.ValidationError({'flight': 'Такого рейса не существует'})

        return attrs

    def create(self, validated_data):
        ticket = TicketInfo.objects.filter(ticket_id=validated_data.get('ticket_id'))
        if ticket.exists():
            return super().update(ticket[0], validated_data)
        data = validated_data
        data['ticket_id'] = get_hash(data)
        return super().create(validated_data)


class CreateTicketInfo(serializers.ModelSerializer):
    class Meta:
        model = TicketInfo
        fields = ['user', 'flight']

    def validate(self, attrs):
        if TicketInfo.objects.filter(ticket_id=get_hash(attrs)).exists():
            raise serializers.ValidationError({'ticket_id': 'Такой билет уже существует'})

        if not CustomUser.objects.filter(username=attrs['user']).exists():
            raise serializers.ValidationError({'user': 'Такого пользователя не существует'})

        if not FlightInfo.objects.filter(flight_id=attrs['flight']).exists():
            raise serializers.ValidationError({'flight': 'Такого рейса не существует'})

        return attrs

    def create(self, validated_data):
        data = validated_data
        data['ticket_id'] = get_hash(data)
        return super().create(data)


class DeleteTicketInfo(serializers.ModelSerializer):
    class Meta:
        model = TicketInfo
        fields = ['ticket_id']

    def validate(self, attrs):
        if not TicketInfo.objects.filter(ticket_id=attrs['ticket_id']).exists():
            raise serializers.ValidationError({'ticket_id': 'Такого билета не существует'})

        return attrs

    def delete(self, validated_data):
        ticket = TicketInfo.objects.filter(ticket_id=validated_data.get('ticket_id'))
        if ticket.exists():
            ticket[0].delete()
            return []
        raise serializers.ValidationError({'ticket_id': 'Такого билета не существует'})


class FindTicketInfo(serializers.ModelSerializer):
    class Meta:
        model = TicketInfo
        fields = ['ticket_id']

    def validate(self, attrs):
        if not TicketInfo.objects.filter(ticket_id=attrs['ticket_id']).exists():
            raise serializers.ValidationError({'ticket_id': 'Такого билета не существует'})

        return attrs
