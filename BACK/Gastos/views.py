from django.shortcuts import render
from .models import Gasto
from .serializers import GastoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class GastoApiView(APIView):
    def get (self, request):
        gastos = Gasto.objects.all()
        serializer = GastoSerializer(gastos, many=True)
        return Response(serializer.data)
    
    def post (self, request):
        serializer = GastoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    