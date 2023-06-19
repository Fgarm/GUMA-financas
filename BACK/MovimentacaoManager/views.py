from http import HTTPStatus
from MovimentacaoManager.models import MovimentacaoManager
from MovimentacaoManager.serializers import MovimentacaoSerializer
from datetime import timedelta
from dateutil.relativedelta import relativedelta
import Gastos.views
import Bancario.views
from Tags.models import Tag
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.http import JsonResponse
import datetime as dt
import numpy as np
from django.contrib.auth.models import User
from Tags.models import Tag
import json


#json.dumps(dict) talvez funcione para transformar em json o dict e enviar pras outras funções

# criar recorrencias
# atualizar recorrencias (alterar algo delas)
# atualizar recorrencias de um user (passar vendo se é pra criar novos gastos, e se sim criar)
# deletar recorrencias
# pegar recorrencias de um user

class ManagerAPIView(APIView):

    @api_view(['POST'])
    def get_recorrencias_user(request):
        try:
            user = User.objects.get(username=request.data["user"])
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        
        recorrencias = MovimentacaoManager.objects.filter(user=user.username)
        serializer = MovimentacaoSerializer(recorrencias, context={'request': request}, many=True)

        return Response(serializer.data)

    @api_view(['POST']) # vai ser necessário chamar essa função toda vez que o usuário checar a home
    def implementar_recorrencia(request):
        try:
            user = User.objects.get(username=request.data["user"])
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        recorrencias = MovimentacaoManager.objects.filter(user=user.username)
        recorrencias = MovimentacaoSerializer(recorrencias, context={'request': request}, many=True)
        if recorrencias.is_valid():
            for recorrencia in recorrencias.data:
                recorrencia = MovimentacaoManager.objects.get(id=recorrencia['id'])
                infos = {}
                muda_o_nome_disso_daqui_dps = {}
                data_atual = dt.datetime.today()
                data_atualizacao = recorrencia.atualizacao
                if recorrencia["frequencia"] == "D":
                    variacao = timedelta(days=1)
                elif recorrencia["frequencia"] == "S":
                    variacao = timedelta(weeks=1)
                elif recorrencia["frequencia"] == "M":
                    variacao = relativedelta(months=1)
                elif recorrencia["frequencia"] == "A":
                    variacao = relativedelta(years=1)
                while data_atual >= data_atualizacao + variacao:
                    # somar a data de atualização
                    data_atualizacao = data_atualizacao + variacao
                    muda_o_nome_disso_daqui_dps["atualizacao"] = data_atualizacao
                    infos['nome'] = recorrencia.nome
                    infos['data'] = data_atualizacao
                    infos['tag'] = recorrencia.tag
                    if recorrencia["tipo"] == "G":          
                        infos['pago'] = recorrencia.pago
                        infos['user'] = recorrencia.user
                        infos['valor'] = recorrencia.valor
                        Gastos.views.GastoApiView.post_gastos(json.dumps(infos))
                        # criar a o novo gasto com a data_atualizacao
                        pass
                    else: # tipo == "S"
                        infos['username'] = recorrencia.user
                        infos['saldo'] = recorrencia.valor
                        Bancario.views.BancarioView.add_saldo(json.dumps(infos))
                        # criar o novo saldo com a data_atualizacao
                        pass
                serializer = MovimentacaoSerializer(recorrencia, data=muda_o_nome_disso_daqui_dps, context={'request': request})
                # Caso der BUG pode ser o culpado (infos não passando todas as infos pro serializer)
                # acho que funciona mais sla
                serializer.save() # salva o serializer pro DB (deve funcionar né)
                
                # atualizar a data na recorrencia




        # passar pelas recorrencias chamando uma função que atualiza elas
        pass

    @api_view(['POST'])
    def criar_recorrencia(request):
        #recorrencia recebe dados o suficiente pra criar o que for criar
        #e uma variavel de controle que indica se vai criar um saldo ou um gasto de forma recorrente
        recorrencia = {}
        frequencia = request.data["frequencia"] # a frequencia da recorrencia
        if frequencia == "Diario":
            recorrencia["frequencia"] = "D"
        elif frequencia == "Semanal":
            recorrencia["frequencia"] = "S"
        elif frequencia == "Mensal":
            recorrencia["frequencia"] = "M"
        elif frequencia == "Anual":
            recorrencia["frequencia"] = "A"
        try:
            user = User.objects.get(username=request.data["user"]) # o nome do usuario do gasto
            recorrencia["user"] = user.username
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        if "tag" in request.data: # a tag do gasto se tiver
            try:
                tag = Tag.objects.get(categoria=request.data["tag"], user=user.username)
                recorrencia["tag"] = tag.categoria
            except Tag.DoesNotExist:
                pass
            except Tag.MultipleObjectsReturned:
                return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)
        recorrencia["data"] = request.data["data"] # data de criação
        recorrencia["valor"] = request.data["valor"] # valor 
        recorrencia["atualizacao"] = request.data["data"] # a ultima atualização foi a data que o ultimo foi criado
        if request.data["tipo"] == "gasto":
            recorrencia["tipo"] = "G"
            data = str(request.data["data"]).split("-")
            date_time = dt.datetime(int(data[0]), int(data[1]), int(data[2]), 0, 0, 0)
            recorrencia["nome"] = request.data["nome"] # nome do gasto
            recorrencia["pago"] = request.data["pago"] # se é pago ou não
            Gastos.views.GastoApiView.post_gastos(json.dumps(recorrencia))
            recorrencia["data"] = date_time.replace(tzinfo=dt.timezone.utc)
            # se der errado(BUG) silenciosamente esse pode ser um culpado
        
        else: #Tipo == saldo
            recorrencia["tipo"] = "S"
            if "nome" in request.data:
                recorrencia["nome"] = request.data["nome"] # nome do saldo
            Bancario.views.BancarioView.add_saldo(json.dumps(recorrencia))

        serializer = MovimentacaoSerializer(data=data, context={'request': request})
        if serializer.is_valid():
                serializer.save()
        else:    
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ManagerAPIView.implementar_recorrencia(user.username)

        return Response(f"Por um milagre deu certo: {serializer.data}", status=status.HTTP_201_CREATED)
