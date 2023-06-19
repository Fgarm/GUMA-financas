from Grupos.models import Gastos_Grupo
from DebGroup.models import Debitos

from rest_framework.views import APIView


class AuxFunctions(APIView):
    def criar_debito(provedor, grupo_gasto, item, valor):
        devedor = Debitos.objects.filter(grupoGasto_id=grupo_gasto).first().grupoGasto_id
        debito = Debitos.objects.create(provedor=provedor,
                                        devedor=devedor, 
                                        grupo_gasto=grupo_gasto, 
                                        valor=valor, 
                                        item=item)







