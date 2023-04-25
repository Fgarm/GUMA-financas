from http import HTTPStatus
import json
from .models import Gasto
from .serializers import GastoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Tags.models import Tag
from django.http import HttpResponse


class GastoApiView(APIView):
    @api_view(['GET'])
    def get_gastos (request): # parâmetro self removido
        if request.method == 'GET':
            # onde o username == request.user (mas talvez seja um post tbm)
            gastos = Gasto.objects.all()
            serializer = GastoSerializer(gastos, context={'request': request}, many=True)
            return Response(serializer.data)
        
    @api_view(['GET'])
    def get_gasto_username(request):
        username = request.data["user"]
        user_id = User.objects.filter(username=username).first()
        #Virificando se User existe
        if not user_id:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            user_id = user_id.id

        gastos = Gasto.objects.filter(user_id=user_id)
        #Virificando de possui gastos
        if not user_id:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        
        gastos_j = {"alunos": []}
        for gasto in gastos:
            data_j = str(gasto.data)
            user_j = str(gasto.user)

            #Verificando se a tag existe ou vai ser nula
            if gasto.tag: tag_j = gasto.tag.categoria
            else: tag_j = None

            gastos_j["alunos"].append(
            {
                "nome": gasto.nome,
                "valor": gasto.valor,
                "data": data_j,
                "pago": gasto.pago,
                "tag": tag_j,
                "user": user_j
            }
    )

        gastos_j = json.dumps(gastos_j, indent=4)
        return HttpResponse(gastos_j)
    
    @api_view(['POST'])
    def post_gastos (request): # parâmetro self removido
        if request.method == 'POST':
            data = {}
            data["nome"] = request.data["nome"]
            data["valor"] = request.data["valor"]
            data["data"] = request.data["data"]
            data["pago"] = request.data["pago"]

            user_id = User.objects.filter(username=request.data["user"]).first()
            if not user_id: 
                return Response(status=status.HTTP_400_BAD_REQUEST)

            user_id = user_id.id
            data["user"] = user_id
            tag_id = Tag.objects.filter(categoria=request.data["tag"]).filter(user=data["user"]).first()
            if not tag_id:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            data["tag"] = tag_id.id
            serializer = GastoSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                
                

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['PUT'])
    def put_gasto (request):
        try:
            print(request.data["id"])
            reqId = request.data["id"]
            gasto = Gasto.objects.get(id=reqId)
        except Gasto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            serializer = GastoSerializer(gasto, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
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
        

