from rest_framework import serializers
from models import Grupo

class grupoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Grupo
        fields= '__all__'