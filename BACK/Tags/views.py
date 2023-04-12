from django.shortcuts import render
from .models import Tag
from .serializers import TagSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class TAgApiView(APIView):
    def get (self, request):
        tags = Gasto.objects.all()
        serializer = GastoSerializer(tags, many=True)
        return Response(serializer.data)
    
    def post (self, request):
        serializer = GastoSerializer(data=request.data) 
        #não há tratamento especial pois virá tratado do front. Ex: cor em RRGGBB em hexa
        serializer.is_valid(raise_exception=True)
        #caso não vier
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)