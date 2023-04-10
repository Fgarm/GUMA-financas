from django.shortcuts import render

# Create your views here.
from .models import Usuario 
from .serializers import UsuarioSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class UsuarioApiView(APIView):
    def get (self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)
    
    def post (self, request):
        serializer = UsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
