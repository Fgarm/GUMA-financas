from http import HTTPStatus
from .models import Gasto
from .serializers import GastoSerializer
from Tags.models import Tag
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import JsonResponse
from datetime import datetime
import numpy as np
from django.contrib.auth.models import User
from Tags.models import Tag
from django.http import QueryDict
import json
from Bancario.models import Bancario


def hex_to_rgba(color):
    return "rgba({}, {}, {}, 0.5)".format(int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16))


class GastoApiView(APIView):
    @api_view(['GET'])
    def get_gastos (request):
        if request.method == 'GET':
            gastos = Gasto.objects.all()
            serializer = GastoSerializer(gastos, context={'request': request}, many=True)
            return Response(serializer.data)

    @api_view(['GET', 'POST'])
    def pegar_gasto_tag_filter_pago(request):

        # obtendo o user selecionado
        try:
            user = User.objects.get(username=request.data["user"])
        # verificando se o user selecionado existe
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)


        try:
            tag = Tag.objects.get(user=user.username, categoria=request.data["tag"])
        except Tag.DoesNotExist:
            return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
        except Tag.MultipleObjectsReturned:
            return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)    
        gasto = Gasto.objects.filter(user=user.username, tag=tag.categoria)

        # verificando se o user tem algum gasto
        if not gasto:
            return Response("Nenhum gasto com essa tag encontrado", status=status.HTTP_404_NOT_FOUND)
        
        # verificando qual é o filtro desejado (pago ou não pago)
        if request.data["pago"]:
            gastos_pagos = gasto.filter(pago=True)

            # verificando se existe algum gasto pago no resultado da consulta
            if not gastos_pagos:
                return Response("Nenhum gasto 'pago' encontrado", status=status.HTTP_404_NOT_FOUND)

            serializer = GastoSerializer(gastos_pagos, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif request.data["pago"] == False:
            gastos_nao_pagos = gasto.filter(pago=False)

            # verificando se existe algum gasto não pago no resultado da consulta
            if not gastos_nao_pagos:
                return Response("Nenhum gasto 'não pago' dessa tag encontrado", status=status.HTTP_404_NOT_FOUND)

            serializer = GastoSerializer(gastos_nao_pagos, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

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
        dados = {}
        if isinstance(request.data, QueryDict):
            dados = json.loads(list(request.data.keys())[0])
            #print("nos gastos:", json.loads(list(request.data.keys())[0]))
            dados["data"] = str(dados["data"]).split()[0]
        else:
            dados = request.data
            print("nos gastos:", request.data)
        if request.method == 'POST':
        
            data = {}
            data["nome"] = dados["nome"]
            data["valor"] = dados["valor"]
            data["data"] = dados["data"]
            data["pago"] = dados["pago"]

            try:
                user = User.objects.get(username=dados["user"])
                data["user"] = user.username
            except User.DoesNotExist:
                return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
            except User.MultipleObjectsReturned:
                return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
            
            if "tag" in dados:
                try:
                    tag = Tag.objects.get(categoria=dados["tag"], user=user.username)
                    data["tag"] = tag.categoria
                except Tag.DoesNotExist:
                    if dados["tag"]:
                        return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
                    pass
                except Tag.MultipleObjectsReturned:
                    return Response("Há muitas tags com mesmo user e name", status=HTTPStatus.BAD_REQUEST)
            
            serializer = GastoSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                #Retirando valor do saldo
                if dados["pago"] == True:
                    conta = Bancario.objects.filter(id_usuario_id=user.id).first()
                    conta.saldo_atual = float(conta.saldo_atual) - float(data["valor"])
                    conta.save()
                print("foi")
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
                if request.data["tag"]:
                    return Response("Não há essa tag", status=HTTPStatus.BAD_REQUEST)
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
        json_response = {'data': data[::-1], 'labels': labels[::-1]}
        return JsonResponse(json_response)


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

        gastos_por_categoria = {}
        gastos_por_categoria['outros'] = 0
        cor_por_categoria = {}
        cor_por_categoria['outros'] = 'dad8d8'

        for tag in tags:
            gastos_por_categoria[tag.categoria] = 0
            cor_por_categoria[tag.categoria] = tag.cor
        
        for gasto in gastos:
            if gasto.tag in gastos_por_categoria:
                gastos_por_categoria[gasto.tag] = gastos_por_categoria[gasto.tag] + gasto.valor
            else:
                gastos_por_categoria["outros"] = gastos_por_categoria["outros"] + gasto.valor
        
        for categoria in gastos_por_categoria:
            if gastos_por_categoria[categoria] != 0:
                data.append(gastos_por_categoria[categoria])
                labels.append(categoria)
                colors.append(cor_por_categoria[categoria])

        if len(data) > 5:

            # argsort "ordena" a lista data de forma crescente e obtém os indices desses valores
            indices = np.argsort(data)

            # do mais relevante (maior) para o menos relevante (menor) - ordem decrescente
            data_maiores_valores = []
            labels_maiores_valores = []
            colors_maiores_valores = []
                
            # obtendo os 5 maiores valores da lista 'data' - os 5 mais relevantes
            data_maiores_valores = [data[i] for i in indices[-1:-6:-1]]
                
            # obtendo quais categorias correspondem à esses maiores valores
            labels_maiores_valores = [labels[i] for i in indices[-1:-6:-1]]

            # obtendo quais cores correspondentes à esses maiores valores
            colors_maiores_valores = [colors[i] for i in indices[-1:-6:-1]]

            json_response = {'data': data_maiores_valores, 'labels': labels_maiores_valores, 'colors': colors_maiores_valores}
            return JsonResponse(json_response)
        
        else:
            
            # retorna as (quantidades de) labels e cores corretamente caso o usuário tenha mais que 5 tags e o total de gastos de uma delas seja zero
            quantidade_valida = data.__len__()
            
            for i in range(quantidade_valida):
                if labels[i] == "outros":
                    labels[i] = "Não classificados"


            if quantidade_valida < 5:
                labels = [labels[i] for i in range(quantidade_valida)]
                colors = [colors[i] for i in range(quantidade_valida)]
                data = [data[i] for i in range(quantidade_valida)]

            # apenas devolve os arrays caso o tamanho seja exatamente 5
            json_response = {'data': data, 'labels': labels, 'colors': colors}
            return JsonResponse(json_response)


    @api_view(['GET', 'POST'])
    def get_media_mensal_por_tag_em_periodo(request):
        
        # obtendo as tags do user selecionado
        try:
            tags = Tag.objects.filter(user=request.data["user"])
            
        # verificando se o user selecionado existe ou se tem alguma tag criada
        except Tag.DoesNotExist:
            return Response("Nome de usuário incorreto ou inexistente ou o usuário não tem nenhuma tag", status=status.HTTP_404_NOT_FOUND)
        
        # obtendo os gastos do user selecionado
        try:
            gastos = Gasto.objects.filter(user=request.data["user"])
            
        # verificando se o user selecionado existe ou se tem algum gasto/saída cadastrado
        except Gasto.DoesNotExist:
            return Response("Username incorreto ou inexistente ou o usuário não tem nenhum gasto", status=status.HTTP_404_NOT_FOUND)


        datasets = []
        labels = f'Últimos {request.data["periodo"]} meses'
        totalGastosPorTagPorMes = []
        media = []

        # obtendo o mês e o ano atuais
        mesAtual = datetime.now().month + 1
        anoAtual = datetime.now().year


        # obtendo a média mensal por tag no período especificado
        for tag in tags:
            
            # obtendo os X meses anteriores do período especificado
            for i in range(int(request.data["periodo"])): # aqui eram os últimos 12 meses - agora é a quantidade de meses que vier na requisição

                mesAtual -= 1
                if mesAtual == 0:
                    mesAtual = 12
                    anoAtual -= 1

                # soma todos os gastos do mês/ano que estão pagos e têm a tag da iteração
                somaGastosPorMesDeUmaTag = np.sum([gasto.valor for gasto in gastos if gasto.data.month == mesAtual and gasto.data.year == anoAtual and gasto.pago == True and gasto.tag == tag.categoria])

                # total de gastos por tag de cada mes do período especificado
                totalGastosPorTagPorMes.append(somaGastosPorMesDeUmaTag)

            mesAtual = datetime.now().month + 1
            anoAtual = datetime.now().year
            
            # calculando a média de gastos mensal daquela tag no período especificado e truncando para 2 casas decimais
            media.append(round((np.sum(totalGastosPorTagPorMes)) / float(request.data["periodo"]), 2))

            # se existir alguma média não nula, essa tag será exibida no gráfico
            if media[0] != 0:
                # adiciona todos os elementos com sua chave e valor dentro de um objeto. E esse objeto será inserido no array datasets
                datasets.append({
                    'label': tag.categoria,
                    'data': media.copy(),
                    'backgroundColor': hex_to_rgba(tag.cor)
                })

            # limpando os arrays para nova iteração
            totalGastosPorTagPorMes.clear()
            media.clear()


        json_response = { 'datasets': datasets, 'labels': labels}

        return JsonResponse(json_response)