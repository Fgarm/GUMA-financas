from rest_framework import serializers

from Usuario.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        extra_kargs = {
            'email': {'write_only': True}
        }
        
        model = Usuario
        fields = (
            'nome',
            'sobrenome',
            'email',
            'senha'        
        )
