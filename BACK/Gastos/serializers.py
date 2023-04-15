from rest_framework import serializers

from Gastos.models import Gasto

class GastoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gasto
        fields = (
            'id',
            'nome',
            'valor',
            'data',
            'pago'        
        )