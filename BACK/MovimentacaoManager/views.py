from http import HTTPStatus
from Gastos.models import Gasto
from Gastos.serializers import GastoSerializer
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

# pegar recorrencias
# criar recorrencias
# atualizar recorrencias (alterar algo delas)
# atualizar recorrencias de um user (passar vendo se é pra criar novos gastos, e se sim criar)
# deletar recorrencias
# pegar recorrencias de um user

class ManagerAPIView(APIView):

    @api_view(['POST']) # vai ser necessário chamar essa função toda vez que o usuário checar a home
    def implementar_recorrencia(request):
        # checar se veio um ID e se sim tentar atualizar ela, se não checa e atualiza todas de um user
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
        if request.data["tipo"] == "gasto":
            recorrencia["tipo"] = "G"
            recorrencia["data"] = request.data["data"] # data de criação
            data = str(request.data["data"]).split("-")
            date_time = dt.datetime(int(data[0]), int(data[1]), int(data[2]), 0, 0, 0)
            recorrencia["nome"] = request.data["nome"] # nome do gasto
            recorrencia["valor"] = request.data["valor"] # valor do gasto
            recorrencia["pago"] = request.data["pago"] # se é pago ou não
            Gastos.views.GastoApiView.post_gastos(json.dumps(recorrencia))
            recorrencia["data"] = date_time.replace(tzinfo=dt.timezone.utc)
            recorrencia["atualizacao"] = request.data["data"] # a ultima atualização foi a data que o ultimo foi criado
        
        else: #Tipo == saldo
            recorrencia["tipo"] = "S"
            recorrencia["valor"] = request.data["valor"] # valor do saldo
            recorrencia["data"] = request.data["data"] # data de criação
            Bancario.views.BancarioView.add_saldo2(json.dumps(recorrencia))
            recorrencia["nome"] = request.data["nome"] # nome do gasto
            recorrencia["atualizacao"] = request.data["data"] # a ultima atualização foi a data que o ultimo foi criado

        # Salvar a recorrencia no BD
        ManagerAPIView.implementar_recorrencia() # passar o id da recorrencia dps de salvar ela e pegar o ID
        

        return Response("Por um milagre deu certo", status=HTTPStatus.ACCEPTED)
        # criar um gasto na data que ele criou a recorrencia
        # marcar a data de atualização pra essa mesma
        # rodar a função de atualizar a recorrencia
        pass
