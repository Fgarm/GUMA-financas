from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Grupo, Gastos_Grupo, Itens, Iten_User, GrupoGasto_User, Grupo_User
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class GrupoView(APIView):

    @api_view(['POST'])
    def cadastrar_grupo(request):
            user_id = User.objects.filter(username=request.data["username"]).first()
            grupo = Grupo.objects.create(nome=request.data["nome"],
                                        descricao=request.data["descricao"],
                                        criador=user_id.id)
            
            Grupo_User.objects.create(grupo_id=grupo.grupo_id, usuario_id=user_id.id)
            return Response("GRUPO CADASTRADO", status=status.HTTP_201_CREATED)
        # try:
        # except:
        #     return Response("GRUPO NÃO CADASTRADO", status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['POST'])
    def cadastrar_gasto_grupo(request):
        try:
            Gastos_Grupo.objects.create(nome_gasto=request.data["nome_gasto"],
                                        id_grupo_id=request.data["id_grupo_id"])
            
            return Response("GASTO CADASTRADO", status=status.HTTP_201_CREATED)
        except:
            return Response("GASTO NÃO CADASTRADO", status=status.HTTP_400_BAD_REQUEST)

    @api_view(['POST'])
    def cadastrar_item(request):  
        try:
            preco_uni = request.data["preco_unitario"]
            quantidade = request.data["quantidade"]
            preco_total = float(preco_uni * quantidade)

            Itens.objects.create(descricao=request.data["descricao"],
                                    id_GastosGrupo_id=request.data["id_GastosGrupo_id"],
                                    preco_unitario=request.data["preco_unitario"],
                                    preco_total_item=preco_total,
                                    quantidade=request.data["quantidade"]
                                )
            
            gasto_g = Gastos_Grupo.objects.filter(grupoGasto_id=request.data["id_GastosGrupo_id"]).first()
            gasto_atual = float(gasto_g.valor_total)
            gasto_g.valor_total = gasto_atual + preco_total
            gasto_g.save()

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
    def associar_usuario_grupo (request):
        print(request)
        print(request.data)
        try:
            user = User.objects.get(username=request.data["user"])
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=status.HTTP_400_BAD_REQUEST)
        try:
            Grupo_User.objects.get(grupo_id=request.data['grupo_id'], usuario_id=user.id)
        except Grupo_User.DoesNotExist:
            pass
        except Grupo_User.MultipleObjectsReturned:
            return Response("Usuário já está no grupo", status=status.HTTP_304_NOT_MODIFIED)

        except ValidationError:
            return Response("Esse id de grupo não é válido", status=status.HTTP_400_BAD_REQUEST)
        try:
            Grupo_User.objects.create(grupo_id=request.data['grupo_id'], usuario_id=user.id)
            return Response("Usuário cadastrado no grupo", status=status.HTTP_201_CREATED)
        except:
            return Response("Usuário não cadastrado no grupo", status=status.HTTP_400_BAD_REQUEST)
        

    @api_view(['POST'])
    def gerar_link_grupo (request):
        return Response(f"http://127.0.0.1:8000/join/?grupo={request.data['uuid_grupo']}")
    

    # Select das informações de grupo

    @api_view(['POST'])
    def grupos_user(request):
        user_id = User.objects.filter(username=request.data["username"]).first()
        grupoUsers = Grupo_User.objects.filter(usuario_id=user_id)
        
        grupo_list = list()
        for grupo_u in grupoUsers:
            grupo = Grupo.objects.filter(grupo_id=grupo_u.grupo_id).first()
            dict_g = {"grupo_id": grupo.grupo_id, "nome": grupo.nome, "descricao": grupo.descricao}
            grupo_list.append(dict_g)

    
        return Response(grupo_list,status=status.HTTP_200_OK)

    @api_view(['POST'])
    def usuarios_grupo(request):
        try:
            grupo_list = Grupo_User.objects.filter(grupo_id=request.data["grupo_id"])
            
            users_list = list()
            for grupo in grupo_list:
                user = User.objects.filter(id=grupo.usuario_id).first()
                user_dict = {"id":user.id, "username":user.username, "nome": f"{user.first_name} {user.last_name}", "email": user.email}
                users_list.append(user_dict)

        
            return Response(users_list,status=status.HTTP_200_OK)
        except:
            null_dic = dict()
            return Response(null_dic ,status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['POST'])
    def gastos_grupo(request):
        try:
            gastos = Gastos_Grupo.objects.filter(id_grupo_id=request.data["grupo_id"])
            gasto_list = list()
            for gasto in gastos:
                gasto_dic = {"gasto_id":gasto.grupoGasto_id, "grupo_id": gasto.id_grupo_id, "nome": gasto.nome_gasto, "valor_total":gasto.valor_total}
                gasto_list.append(gasto_dic)
            return Response(gasto_list, status=status.HTTP_200_OK)  
        except:
            null_dic = dict()
            return Response(null_dic, status=status.HTTP_400_BAD_REQUEST)  
        
    @api_view(['POST'])    
    def itens_gasto(request):
        itens = Itens.objects.filter(id_GastosGrupo_id=request.data["gasto_id"])
        
        itens_list = list()
        for item in itens:
            itens_dict = {"item_id": item.item_id, "descricao": item.descricao,"preco_unitario":item.preco_unitario, "quantidade": item.quantidade, "preco_total": item.preco_total_item}
            itens_list.append(itens_dict)
        return Response(itens_list, status=status.HTTP_200_OK)
    

    @api_view(['POST'])    
    def peso_user_item(request):
        its = Iten_User.objects.filter(item_id=request.data["item_id"])
        
        its_list = list()
        for it in its:
            username = User.objects.filter(id=it.usuario_id).first().username
            its_dict = {"usuario": username, "peso":it.peso}
            its_list.append(its_dict)
        return Response(its_list, status=status.HTTP_200_OK)
    
    @api_view(['POST'])    
    def usuarios_em_gastos(request):
        user_gastos = GrupoGasto_User.objects.filter(conta_id=request.data["gasto_id"])

        userg_list = list()
        for ug in user_gastos:
            username = User.objects.filter(id=ug.usuario_id).first().username
            ug_dict = {"username": username}   
            userg_list.append(ug_dict)         
        return Response(userg_list, status=status.HTTP_200_OK)

