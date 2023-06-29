from Grupos.models import Gastos_Grupo
from DebGroup.models import Debitos
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class AuxDebitos(APIView):
    def criar_debito(valor, devedor, provedor, item, grupo_gasto_id):
        
        debito = Debitos.objects.create(valor=valor, devedor_id=devedor, provedor_id=provedor,
                                        item_id=item, grupo_gasto_id=grupo_gasto_id)

class Debitosview(APIView):
    @api_view(['POST'])
    def obter_devedores(request):
        user_id = User.objects.filter(username=request.data["user"]).first().id #pegar os que devem para Um user

        debitos_user = Debitos.objects.filter(provedor=user_id)

        relacao_devedores = dict()
        for debito in debitos_user:
            deb_group_id = (str(debito.grupo_gasto_id)).replace('-','')
            if deb_group_id == request.data["gasto_id"]:
                username_dev = User.objects.filter(id=debito.devedor_id).first().username

                if username_dev in relacao_devedores:
                    relacao_devedores[username_dev] = relacao_devedores[username_dev]+debito.valor
                else:
                    relacao_devedores[username_dev] = debito.valor

        return Response(relacao_devedores ,status=status.HTTP_200_OK)
                
    @api_view(['POST'])
    def obter_recebedores(request):
        user_id = User.objects.filter(username=request.data["user"]).first().id #pegar os que devem para Um user

        debitos_user = Debitos.objects.filter(devedor_id=user_id)

        relacao_devedores = dict()
        for debito in debitos_user:
            deb_group_id = (str(debito.grupo_gasto_id)).replace('-','')
            if deb_group_id == request.data["gasto_id"]:
                username_dev = User.objects.filter(id=debito.devedor_id).first().username

                if username_dev in relacao_devedores:
                    relacao_devedores[username_dev] = relacao_devedores[username_dev]+debito.valor
                else:
                    relacao_devedores[username_dev] = debito.valor

        return Response(relacao_devedores ,status=status.HTTP_200_OK)