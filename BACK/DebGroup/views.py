from Grupos.models import Gastos_Grupo
from DebGroup.models import Debitos
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.contrib.auth.models import User


class AuxDebitos(APIView):
    def criar_debito(valor, devedor, provedor, item, grupo_gasto_id):
        
        debito = Debitos.objects.create(valor=valor, devedor_id=devedor, provedor_id=provedor,
                                        item_id=item, grupo_gasto_id=grupo_gasto_id)
        

class DebGroupView(APIView):
    
    @api_view(['POST'])
    def user_dividas(request):
        user_dividas = Debitos.objects.filter(grupo_gasto_id=request.data["grupo_gasto_id"])
        user_id = User.objects.filter(username=request.data["username"])

        
        for divida in user_dividas:
            if user_id == divida.devedor:
