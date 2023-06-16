from Grupos.models import Gastos_Grupo
from DebGroup.models import Debitos

from rest_framework.views import APIView


class AuxFunctions(APIView):
    def criar_debito(provedor, devedor, grupo, item, valor):
        debito = Debitos.objects.create(provedor=provedor, devedor=devedor, valor=valor, grupo=grupo, item=item)






