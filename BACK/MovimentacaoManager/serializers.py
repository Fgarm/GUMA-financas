from rest_framework import serializers

from MovimentacaoManager.models import MovimentacaoManager

class MovimentacaoSerializer(serializers.ModelSerializer):

    class Meta:
        model = MovimentacaoManager
        fields = (
            'id',
            'nome',
            'valor',
            'data',
            'pago',
            'tag', 
            'user',
            'atualizacao',
            'tipo',
            'frequencia'
        )