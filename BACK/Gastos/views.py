from http import HTTPStatus
from .models import Gasto
from .serializers import GastoSerializer
from Tags.models import Tag
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.http import JsonResponse
from datetime import datetime
import numpy as np


class GastoApiView(APIView):
    @api_view(['GET'])
    def get_gastos (request):
        if request.method == 'GET':
            gastos = Gasto.objects.all()
            serializer = GastoSerializer(gastos, context={'request': request}, many=True)
            return Response(serializer.data)


    @api_view(['POST'])
    def pegar_gasto_tag(request):
        
        if request.method == 'POST':
            try:
                user = User.objects.get(username=request.data["user"])
            except User.DoesNotExist:
                return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
            
            try:
                tag = Tag.objects.get(user=user.username, categoria=request.data["tag"])
            except Tag.DoesNotExist:
                return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
            except Tag.MultipleObjectsReturned:
                return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)
            
            gasto = Gasto.objects.filter(user=user.username, tag=tag.categoria)
            serializer = GastoSerializer(gasto, context={'request': request}, many=True)
            
            return Response(serializer.data, status=HTTPStatus.ACCEPTED)


    @api_view(['GET', 'POST'])
    def get_gasto_username(request):
        
        try:
            user = User.objects.get(username=request.data["user"])
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        
        gastos = Gasto.objects.filter(user=user.username)

        serializer = GastoSerializer(gastos, context={'request': request}, many=True)
        return Response(serializer.data)


    @api_view(['POST'])
    def post_gastos (request):
        
        if request.method == 'POST':
        
            data = {}
            data["nome"] = request.data["nome"]
            data["valor"] = request.data["valor"]
            data["data"] = request.data["data"]
            data["pago"] = request.data["pago"]

            try:
                user = User.objects.get(username=request.data["user"])
                data["user"] = user.username
            except User.DoesNotExist:
                return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
            except User.MultipleObjectsReturned:
                return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
            
            if "tag" in request.data:
                try:
                    tag = Tag.objects.get(categoria=request.data["tag"], user=user.username)
                    data["tag"] = tag.categoria
                except Tag.DoesNotExist:
                    #return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
                    # ToDo: descomentar esse code depois da apresentação do Hubner
                    pass
                except Tag.MultipleObjectsReturned:
                    return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)
            
            serializer = GastoSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @api_view(['PUT'])
    def put_gasto (request):

        try:
            gasto = Gasto.objects.get(id=request.data["id"])
        except Gasto.DoesNotExist:
            return Response("Não há gasto com esse id", status=status.HTTP_404_NOT_FOUND)
        
        data = {}
        data["nome"] = request.data["nome"]
        data["valor"] = request.data["valor"]
        data["data"] = request.data["data"]
        data["pago"] = request.data["pago"]
        data["tag"] = gasto.tag

        print("\nrequest.data antes if: ", request.data)
        print("\ntag em request: ", request.data["tag"])

        if "tag" in request.data:
            try:
                if request.data["tag"] == "":

                    print("\nCAIU AQUI 1\n")
                    data["tag"] = None

                elif request.data["tag"] is None:

                    print("\nCAIU AQUI 2\n")
                    data["tag"] = None

                else:
                    print("\nDEU BAO CARAI\n")
                    tag = Tag.objects.get(categoria=request.data["tag"], user=gasto.user) # mas esta linha "não executa"
                    print("tag: ", tag)
                    print("tag.categoria: ", tag.categoria)
                    data["tag"] = tag.categoria

            except Tag.DoesNotExist:
                #return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
                #TODO: descomentar esse code depois da apresentação do Hubner
                pass
            except Tag.MultipleObjectsReturned:
                return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)

        print("request: ", request.data)
        print("data: ", data)
        
        if request.method == 'PUT':
            serializer = GastoSerializer(gasto, data=data, context={'request': request})
            print("serializer: ", serializer.initial_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @api_view(['DELETE'])
    def delete_gasto (request):
        try:
            gasto = Gasto.objects.get(id=request.data["id"])
        except Gasto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'DELETE':
            gasto.delete()
            return Response("Deletado com sucesso", status=status.HTTP_204_NO_CONTENT)
        

    @api_view(['GET', 'POST'])
    def get_gasto_filter_pago(request):

        # obtendo o user selecionado
        try:
            user = User.objects.get(username=request.data["user"])
        # verificando se o user selecionado existe
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)


        # Obtendo todos os gastos do usuario selecionado
        gastos = Gasto.objects.filter(user=user.username)

        # verificando se o user tem algum gasto
        if not gastos:
            return Response("Nenhum gasto encontrado", status=status.HTTP_404_NOT_FOUND)
        
        # verificando qual é o filtro desejado (pago ou não pago)
        if request.data["pago"]:
            gastos_pagos = gastos.filter(pago=True)

            # verificando se existe algum gasto pago no resultado da consulta
            if not gastos_pagos:
                return Response("Nenhum gasto 'pago' encontrado", status=status.HTTP_404_NOT_FOUND)

            serializer = GastoSerializer(gastos_pagos, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif request.data["pago"] == False:
            gastos_nao_pagos = gastos.filter(pago=False)

            # verificando se existe algum gasto não pago no resultado da consulta
            if not gastos_nao_pagos:
                return Response("Nenhum gasto 'não pago' encontrado", status=status.HTTP_404_NOT_FOUND)

            serializer = GastoSerializer(gastos_nao_pagos, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


    @api_view(['GET', 'POST'])
    def get_total_gastos_meses_anteriores(request):

        # print("request: ", request.data)
        # print("user: ", request.data["user"])

        # obtendo os gastos do user selecionado
        try:
            gastos = Gasto.objects.filter(user=request.data["user"])
            print("gastos", gastos)
            
        # verificando se o user selecionado existe
        except Gasto.DoesNotExist:
            return Response("Username incorreto ou inexistente ou o usuário não tem nenhum gasto", status=status.HTTP_404_NOT_FOUND)
        
        meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        data = []
        labels = []

        # obtendo o mês e o ano atuais
        mesAtual = datetime.now().month + 1
        anoAtual = datetime.now().year

        # somando todos os gastos de cada mês durante os 12 meses anteriores
        for i in range(12):

            mesAtual -= 1
            if mesAtual == 0:
                mesAtual = 12
                anoAtual -= 1

            # soma todos os gastos do mês/ano daquela iteração
            somaTodosGastosMes = np.sum([gasto.valor for gasto in gastos if gasto.data.month == mesAtual and gasto.data.year == anoAtual and gasto.pago == True]) # incluir apenas gastos pagos? discutir
            
            # adicionando os meses na lista de labels que será usada no gráfico
            labels.append(meses[mesAtual-1])

            # adicionando a soma dos gastos de cada mês na lista de dados que será exibida no gráfico
            data.append(somaTodosGastosMes)

        # inverte ambas listas para ficar da forma correta no gráfico
        data_json = {'data': data[::-1], 'labels': labels[::-1]}
        return JsonResponse(data_json)


    @api_view(['GET', 'POST'])
    def get_gastos_mais_relevantes(request):

        # obtendo as tags do user selecionado
        try:
            tags = Tag.objects.filter(user=request.data["user"])
            
        # verificando se o user selecionado existe
        except Tag.DoesNotExist:
            return Response("Nome de usuário incorreto ou inexistente ou o usuário não tem nenhuma tag", status=status.HTTP_404_NOT_FOUND)
        
        # obtendo os gastos do usuário naquele mês e naquele ano
        try:
            gastos = Gasto.objects.filter(user=request.data["user"], data__month=request.data["mes"], data__year=request.data["ano"])

        except Gasto.DoesNotExist:
            return Response("O usuário não tem nenhum gasto no período especificado", status=status.HTTP_404_NOT_FOUND)

        data = []   # cada posição: valor total de gastos daquela tag 
        labels = [] # tags
        colors = [] # cor de cada tag

        for tag in tags:

            # obtendo a soma do valor de todos os gastos que têm aquela categoria/tag
            totalGastosPorTag = np.sum([gasto.valor for gasto in gastos if gasto.tag == tag.categoria])
            
            # adicionando a soma do valor dos gastos de uma categoria/tag na lista de dados que será exibida no gráfico
            data.append(totalGastosPorTag)

            # inserindo o nome da tag
            labels.append(tag.categoria)

            # adicionando a cor da tag
            colors.append(tag.cor)

        if len(data) > 5:

            print("data orig: ", data)

            # argsort "ordena" a lista data de forma crescente e obtém os indices desses valores
            indices = np.argsort(data)
            #print("data ordenado: ", data)
            print("indices", indices)

            # do mais relevante (maior) para o menos relevante (menor) - ordem decrescente
            data_maiores_valores = []
            labels_maiores_valores = []
            colors_maiores_valores = []
            
            i = 4
            while i > -1:
                
                # obtendo os 5 maiores valores da lista 'data' - os 5 mais relevantes
                data_maiores_valores.append(data[indices[i]])
                
                # obtendo quais categorias correspondem à esses maiores valores
                labels_maiores_valores.append(labels[indices[i]])

                # obtendo quais cores correspondentes à esses maiores valores
                colors_maiores_valores.append(colors[indices[i]])

                i -= 1

            data_json = {'data': data_maiores_valores, 'labels': labels_maiores_valores, 'colors': colors_maiores_valores}
            print("json enviado: ", data_json)
            return JsonResponse(data_json)
        
        # só devolve os arrays do tamanho que eles tiverem
        else:

            data_json = {'data': data, 'labels': labels, 'colors': colors}
            print("json enviado: ", data_json)
            return JsonResponse(data_json)
