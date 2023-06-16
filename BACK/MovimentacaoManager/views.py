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

        pass

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

        for recorrencia in recorrencias:
            if recorrencia["tipo"] == "G":
                #passar pela recorrencia criando os gastos quando é a data certa (criar com a data certa)
                data_atual = dt.datetime.today()
                data_atualizacao = recorrencia["atualizacao"]
                # Add time to the datetime object
                # dt = dt + timedelta(days=1)
                # dt = dt + timedelta(weeks=1)
                # dt = dt + relativedelta(months=1)
                # dt = dt + relativedelta(years=1)
                while data_atual > data_atualizacao:  # verificar essa verificação aí:
                                                      # é preciso que vc atualize no dia certo
                                                      # não atualize no futuro
                                                      # mantenha o dia que precisa atualizar
                                                      
                    # criar a recorrencia
                    # atualizar a data na recorrencia
                    # somar a data de atualização
                    pass

                pass
            else: # tipo == "S"
                pass




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
            recorrencia["data"] = date_time.replace(tzinfo=dt.timezone.utc) # se der errado silenciosamente esse pode ser um culpado
        
        else: #Tipo == saldo
            recorrencia["tipo"] = "S"
            if "nome" in request.data:
                recorrencia["nome"] = request.data["nome"] # nome do saldo
            Bancario.views.BancarioView.add_saldo2(json.dumps(recorrencia))

        serializer = MovimentacaoSerializer(data=data, context={'request': request})
        if serializer.is_valid():
                serializer.save()
        else:    
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ManagerAPIView.implementar_recorrencia(user.username)

        return Response(f"Por um milagre deu certo: {serializer.data}", status=status.HTTP_201_CREATED)
