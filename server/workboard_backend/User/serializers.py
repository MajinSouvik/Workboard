from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

# Uuser=get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields ="__all__"

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Password should not be readable
        }

    # Overriding create method to handle password hashing
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(RegistrationSerializer, self).create(validated_data)
