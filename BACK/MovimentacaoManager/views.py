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
from django.http import HttpRequest
from urllib.request import Request, urlopen
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

class ManagerView(APIView):

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
        return ManagerView._implementar_recorrencia(request.data["user"])
        
    def _implementar_recorrencia(username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        recorrencias = MovimentacaoManager.objects.filter(user=user.username)
        #recorrencias = MovimentacaoSerializer(data=recorrencias, many=True)
        #print(recorrencias.is_valid())
        #if recorrencias.is_valid():
            #recorrencias = recorrencias.data
        #print("++++++++++++++++++++++++++++++++")
        stat = status.HTTP_400_BAD_REQUEST
        for recorrencia in recorrencias:
            #print(recorrencia.nome)
            #print("---------------------------------")
            recorrencia = MovimentacaoManager.objects.get(id=recorrencia.id)
            infos = {}
            data_atual = dt.datetime.today()
            data_atual = data_atual.replace(tzinfo=dt.timezone.utc)
            data_atualizacao = recorrencia.atualizacao
            if recorrencia.frequencia == "D":
                variacao = timedelta(days=1)
            elif recorrencia.frequencia == "S":
                variacao = timedelta(weeks=1)
            elif recorrencia.frequencia == "M":
                variacao = relativedelta(months=1)
            elif recorrencia.frequencia == "A":
                variacao = relativedelta(years=1)
            while data_atual >= data_atualizacao + variacao:
                # somar a data de atualização
                data_atualizacao = data_atualizacao + variacao
                recorrencia.atualizacao = data_atualizacao
                infos['nome'] = recorrencia.nome
                infos['data'] = data_atualizacao
                if recorrencia.tag:
                    infos['tag'] = recorrencia.tag
                if recorrencia.tipo == "G":          
                    infos['pago'] = recorrencia.pago
                    infos['user'] = username
                    infos['valor'] = recorrencia.valor
                    infos['data'] = str(infos['data'])

                    #print("\n\n")
                    #print(infos)
                    #print("\n\n")
                    # print("heloo")
                    response = urlopen(
                        Request("http://127.0.0.1:8000/api/gastos/criar-gasto/",
                            data=json.dumps(infos).encode('utf-8'),
                            headers={}, origin_req_host=None,
                            unverifiable=False, method='POST')
                    )
                    stat = response.status
                    

                    #print("\n\n")
                    #print(response)
                    #print("\n\n")
                    #print(f"cadastrou: {infos}")
                    #Gastos.views.GastoApiView.post_gastos(json.dumps(infos))
                    # criar a o novo gasto com a data_atualizacao
                else: # tipo == "S"
                    infos['user'] = username
                    infos['saldo'] = recorrencia.valor
                    infos['data'] = str(infos['data'])
                    response = urlopen(
                        Request("http://127.0.0.1:8000/bancario/add-saldo/",
                            data=json.dumps(infos).encode('utf-8'),
                            headers={}, origin_req_host=None,
                            unverifiable=False, method='POST')
                    )
                    stat = response.status
                    # Não funciona (tem que adicionar o envio de saldo que funcione)
                    # Bancario.views.BancarioView.add_saldo(json.dumps(infos))
                    # criar o novo saldo com a data_atualizacao
                    pass
            
            recorrencia.save() # salva o serializer pro DB (deve funcionar né)
        return Response("passou I guess",status=stat)
            # atualizar a data na recorrencia





    @api_view(['POST'])
    def criar_recorrencia(request):
        #print("\n\n")
        #print("\n\n")
        #recorrencia recebe dados o suficiente pra criar o que for criar
        #e uma variavel de controle que indica se vai criar um saldo ou um gasto de forma recorrente
        recorrencia = {}
        frequencia = request.data["frequencia"] # a frequencia da recorrencia
        stat = None
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
        data = str(request.data["data"]).split("-")
        date_time = dt.datetime(int(data[0]), int(data[1]), int(data[2]), 0, 0, 0)
        recorrencia["data"] = str(date_time.replace(tzinfo=dt.timezone.utc))
        if request.data["tipo"] == "gasto":
            recorrencia["tipo"] = "G"
            recorrencia["nome"] = request.data["nome"] # nome do gasto
            recorrencia["pago"] = request.data["pago"] # se é pago ou não
            #print(request.headers)
            #print("a primeira vez", recorrencia)
            response = urlopen(
                        Request("http://127.0.0.1:8000/api/gastos/criar-gasto/",
                            data=json.dumps(recorrencia).encode('utf-8'),
                            headers={}, origin_req_host=None,
                            unverifiable=False, method='POST')
                    )
            stat = response.status
            #Gastos.views.GastoApiView.post_gastos(json.dumps(recorrencia))
            # se der errado(BUG) silenciosamente esse pode ser um culpado
        
        else: #Tipo == saldo
            recorrencia["tipo"] = "S"
            if "nome" in request.data:
                recorrencia["nome"] = request.data["nome"] # nome do saldo
            response = urlopen(
                        Request("http://127.0.0.1:8000/bancario/add-saldo/",
                            data=json.dumps(recorrencia).encode('utf-8'),
                            headers={}, origin_req_host=None,
                            unverifiable=False, method='POST')
                    )
            stat = response.status
            # Não funciona (tem que adicionar o envio de saldo que funcione)
            # Bancario.views.BancarioView.add_saldo(json.dumps(recorrencia))

        serializer = MovimentacaoSerializer(data=recorrencia, context={'request': request})
        if serializer.is_valid():
                serializer.save()
        else:    
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ManagerView._implementar_recorrencia(str(user.username))

        return Response(f"Por um milagre deu certo: {serializer.data}", status=stat)
