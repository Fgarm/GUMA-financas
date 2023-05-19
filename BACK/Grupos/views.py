from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Grupo, Gastos_Grupo, Itens, Iten_User, GrupoGasto_User, Grupo_User
from .serializer import GastoGrupoSerializer, GrupoSerializer, ItensSerializer
import zlib
from base64 import urlsafe_b64encode as b64e, urlsafe_b64decode as b64d


class GrupoView(APIView):

    @api_view(['POST'])
    def cadastrar_grupo(request):
        try:
            Grupo.objects.create(nome=request.data["nome"], descricao=request.data["descricao"])
            return Response("GRUPO CADASTRADO", status=status.HTTP_201_CREATED)
        except:
            return Response("GRUPO NÃO CADASTRADO", status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['POST'])
    def cadastrar_gasto_grupo(request):
        try:
            Gastos_Grupo.objects.create(valor_total=request.data["valor_total"], 
                                        nome_gasto=request.data["nome_gasto"],
                                        id_grupo_id=request.data["id_grupo_id"])
            
            return Response("GASTO CADASTRADO", status=status.HTTP_201_CREATED)
        except:
            return Response("GASTO NÃO CADASTRADO", status=status.HTTP_400_BAD_REQUEST)

    @api_view(['POST'])
    def cadastrar_item(request):  

        try:
            Itens.objects.create(descricao=request.data["descricao"],
                                 id_GastosGrupo_id=request.data["id_GastosGrupo_id"],
                                 preco=request.data["preco"])
            return Response("ITEM CADASTRADO", status=status.HTTP_201_CREATED)
        except:
            return Response("ITEM NÃO CADASTRADO", status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['POST'])
    def associar_item_user(request):
        users_item = request.data["user_itens"].split(",")
        try:
            for item in users_item:
                item = item[1:-1]
                user_id, item_id, peso = item.split("-")
                Iten_User.objects.create(item_id=item_id, usuario_id=user_id, peso=peso)
                
            return Response("ASSOCIACAO CADASTRADA", status=status.HTTP_201_CREATED)
        except:
            return Response("ASSOCIACAO NÃO CADASTRADA", status=status.HTTP_400_BAD_REQUEST)
    
    @api_view(['POST'])
    def associar_user_grupoGastos(request): 
        users_conta = request.data["user_contas"].split(",")
        try:
            for item in users_conta:
                item = item[1:-1]
                user_id, conta_id, pago = item.split("-")
                GrupoGasto_User.objects.create(conta_id=conta_id, usuario_id=user_id, pago=pago)
                
            return Response("ASSOCIACAO CADASTRADA", status=status.HTTP_201_CREATED)
        except:
            return Response("ASSOCIACAO NÃO CADASTRADA", status=status.HTTP_400_BAD_REQUEST)
        

    @api_view(['POST'])
    def cadastrar_usuario_grupo (request):
        try:
            Grupo_User.objects.create(item_id=request.data['item_id'], usuario_id=request.data['user_id'])
            return Response("USUARIO CADASTRADA", status=status.HTTP_201_CREATED)
        except:
            return Response("USUARIO NÃO CADASTRADA", status=status.HTTP_400_BAD_REQUEST)
        

    @api_view(['POST'])
    def gerar_link_grupo (request):
        return Response(f"http://127.0.0.1:8000/grupos/entrar-com-link-grupo/?grupo={request.data['uuid_grupo']}")
    
    @api_view(['POST'])
    def entrar_com_link (request):
        try:
            Grupo_User.objects.create(grupo_id=request.query_params.get('grupo'), usuario_id=request.data['user_id'])
            return Response("USUARIO CADASTRADA", status=status.HTTP_201_CREATED)
        except:
            return Response("USUARIO NÃO CADASTRADA", status=status.HTTP_400_BAD_REQUEST)
        