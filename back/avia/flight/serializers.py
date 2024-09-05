from rest_framework import serializers
import hashlib

from .models import *


class ListFlightInfo(serializers.ModelSerializer):
    class Meta:
        model = FlightInfo
        fields = ['flight_id', 'place_of_departure', 'place_of_arrival', 'airline_name', 'number_of_passengers', 'departure_date']


def get_hash(validated_data):
    return hashlib.sha256(f'{validated_data.get("place_of_departure")}{validated_data.get("airline_name")}{validated_data.get("number_of_passengers")}{validated_data.get("departure_date")}'.encode()).hexdigest()


class ChangeFlightInfo(serializers.ModelSerializer):
    class Meta:
        model = FlightInfo
        fields = ['flight_id', 'place_of_departure', 'place_of_arrival', 'airline_name', 'number_of_passengers', 'departure_date']

    def validate(self, attrs):
        if not FlightInfo.objects.filter(flight_id=attrs['flight_id']).exists():
            raise serializers.ValidationError({'flight_id': 'Такого рейса не существует'})

        return attrs

    def create(self, validated_data):
        flight = FlightInfo.objects.filter(flight_id=validated_data.get('flight_id'))
        if flight.exists():
            return super().update(flight[0], validated_data)
        data = validated_data
        data['flight_id'] = get_hash(data)
        return super().create(validated_data)


class CreateFlightInfo(serializers.ModelSerializer):
    class Meta:
        model = FlightInfo
        fields = ['place_of_departure', 'place_of_arrival', 'airline_name', 'number_of_passengers', 'departure_date']

    def validate(self, data):
        if FlightInfo.objects.filter(flight_id=get_hash(data)).exists():
            raise serializers.ValidationError({'flight_id': 'Такой рейс уже существует'})

        return data

    def create(self, validated_data):
        data = validated_data
        data['flight_id'] = get_hash(data)
        return super().create(data)


class DeleteFlightInfo(serializers.ModelSerializer):
    class Meta:
        model = FlightInfo
        fields = ['flight_id']

    def validate(self, data):
        if not FlightInfo.objects.filter(flight_id=data['flight_id']).exists():
            raise serializers.ValidationError({'flight_id': 'Такого рейса не существует'})

        return data

    def delete(self, validated_data):
        flight = FlightInfo.objects.filter(flight_id=validated_data.get('flight_id'))
        if flight.exists():
            flight[0].delete()
            return []
        raise serializers.ValidationError({'flight_id': 'Такого рейса не существует'})


class FindFlightInfo(serializers.ModelSerializer):
    class Meta:
        model = FlightInfo
        fields = ['flight_id']

    def validate(self, attrs):
        if not FlightInfo.objects.filter(flight_id=attrs['flight_id']).exists():
            raise serializers.ValidationError({'flight_id': 'Такого рейса не существует'})

        return attrs
