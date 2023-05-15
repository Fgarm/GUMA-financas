from rest_framework import serializers
from .models import Grupo, Gastos_Grupo, Itens

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Grupo
        fields= '__all__'

class GastoGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Gastos_Grupo
        fields= '__all__'


class ItensSerializer(serializers.ModelSerializer):
    class Meta:
        model= Itens
        fields= '__all__'