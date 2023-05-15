from http import HTTPStatus
from .models import Gasto
from .serializers import GastoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Tags.models import Tag



class GastoApiView(APIView):
    @api_view(['GET'])
    def get_gastos (request): # parâmetro self removido
        if request.method == 'GET':
            # onde o username == request.user (mas talvez seja um post tbm)
            gastos = Gasto.objects.all()
            serializer = GastoSerializer(gastos, context={'request': request}, many=True)
            return Response(serializer.data)
        

    @api_view(['POST'])
    def pegar_gasto_tag(request):
        if request.method == 'POST':
            user_id = User.objects.filter(username=request.data["user"]).first()
            if not user_id:
                return Response("sem user", status=HTTPStatus.BAD_REQUEST)
            tag = Tag.objects.filter(user=user_id.id, categoria=request.data["tag"]).first()
            if not tag:
                return Response("sem tag", status=HTTPStatus.BAD_REQUEST)
            gasto = Gasto.objects.filter(user=user_id.id, tag=tag)
            serializer = GastoSerializer(gasto, context={'request': request}, many=True)
            return Response(serializer.data, status=HTTPStatus.ACCEPTED)

    @api_view(['GET', 'POST'])
    def get_gasto_username(request):
        #print("parametros?:", request.query_params)
        #print("dados?:", request.data)
        username = request.data["user"]
        user_id = User.objects.filter(username=username).first()
        #Verificando se User existe
        if not user_id:
            return Response("user errado", status=status.HTTP_404_NOT_FOUND)
        else:
            user_id = user_id.id

        gastos = Gasto.objects.filter(user_id=user_id)
        #Virificando de possui gastos

        serializer = GastoSerializer(gastos, context={'request': request}, many=True)
        return Response(serializer.data)
    
    @api_view(['POST'])
    def post_gastos (request): # parâmetro self removido
        if request.method == 'POST':
            data = {}
            data["nome"] = request.data["nome"]
            data["valor"] = request.data["valor"]
            data["data"] = request.data["data"]
            data["pago"] = request.data["pago"]
            print("0:  ", data)

            user_id = User.objects.filter(username=request.data["user"]).first()
            if not user_id: 
                return Response("user errado", status=status.HTTP_400_BAD_REQUEST)

            user_id = user_id.id
            data["user"] = user_id
            try:
                tag_id = Tag.objects.filter(categoria=request.data["tag"]).filter(user=data["user"]).first()
                if tag_id:
                    data["tag"] = tag_id.id
            except KeyError:
                pass
                #return Response("n tem essa tag", status=status.HTTP_400_BAD_REQUEST)
            print("1:  ",data)
            serializer = GastoSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                serializer.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['PUT'])
    def put_gasto (request):
        try:
            #print(request.data["id"])
            reqId = request.data["id"]
            gasto = Gasto.objects.get(id=reqId)
        except Gasto.DoesNotExist:
            return Response("Não há gasto com esse id", status=status.HTTP_404_NOT_FOUND)
        data = {}
        data["nome"] = request.data["nome"]
        data["valor"] = request.data["valor"]
        data["data"] = request.data["data"]
        data["pago"] = request.data["pago"]
        tag = Tag.objects.filter(user=gasto.user, categoria=request.data["tag"]).first()
        if tag:
            data["tag"] = tag.id
        

        if request.method == 'PUT':
            serializer = GastoSerializer(gasto, data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['DELETE'])
    def delete_gasto (request):
        try:
            print(request.data["id"])
            reqId = request.data["id"]
            gasto = Gasto.objects.get(id=reqId)
        except Gasto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'DELETE':
            gasto.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        

    @api_view(['GET', 'POST'])
    def get_gasto_filter_pago(request):

        # print("parametros: ", request.query_params)
        # print("dados: ", request.data)
        # print(request.data)

        # obtendo o user selecionado
        username = request.data["user"]
        user_id = User.objects.filter(username=username).first()

        # verificando se o user selecionado existe
        if not user_id:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)

        # Obtendo todos os gastos do usuario selecionado
        user_id = user_id.id
        gastos = Gasto.objects.filter(user_id=user_id)

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
