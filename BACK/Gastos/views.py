from django.shortcuts import render
from .models import Gasto
from .serializers import GastoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view

class GastoApiView(APIView):
    @api_view(['GET'])
    def get_gastos (request): # parâmetro self removido
        if request.method == 'GET':
            gastos = Gasto.objects.all()
            serializer = GastoSerializer(gastos, context={'request': request}, many=True)
            return Response(serializer.data)
    
    @api_view(['POST'])
    def post (request): # parâmetro self removido
        if request.method == 'POST':
            serializer = GastoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['PUT'])
    def put (request, id):
        try:
            gasto = Gasto.objects.get(id=id)
        except Gasto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            serializer = GastoSerializer(gasto, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['DELETE'])
    def delete (request, id):
        try:
            gasto = Gasto.objects.get(id=id)
        except Gasto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'DELETE':
            gasto.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
