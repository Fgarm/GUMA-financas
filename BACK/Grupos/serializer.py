from rest_framework import serializers
from models import *

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Grupo
        fields= '__all__'


class Gastos_GrupoSerializer(serializers.ModelSerializer):
        
    class Meta:
        model= Gastos_Grupo
        fields= '__all__'

