from django.shortcuts import render
from .models import *
from .serializers import GrupoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from http import HTTPStatus


class GrupoApiView(APIView):
    @api_view(['POST'])
    def cadastrar(request):
        pass

# Create your views here.
