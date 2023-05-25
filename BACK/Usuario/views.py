from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from http import HTTPStatus
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
import requests
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from Usuario.serializer import UserSerializer
from Bancario.models import Bancario, Saldos
import datetime


@csrf_exempt
@api_view(['GET','POST'])
def cadastro (request):

    serializer = UserSerializer(data=request.data)
    if (not serializer.is_valid()): return HttpResponse(HTTPStatus.BAD_REQUEST)

    user = User.objects.filter(username=serializer.data["username"]).first()
    email = User.objects.filter(email=serializer.data["email"]).first()

    if user:
        return Response(status=status.HTTP_409_CONFLICT)
    if email:
        return Response(status=status.HTTP_409_CONFLICT)
    
    user = User.objects.create_user(
        username=serializer.data["username"], 
        email=serializer.data["email"], 
        password=serializer.data["password"]
    )

    Bancario.objects.create(saldo_atual=0, id_usuario_id=user.id, date=datetime.date.today())

    user.first_name = serializer.data["first_name"]
    user.last_name = serializer.data["last_name"]
    user.save()

    return HttpResponse(HTTPStatus.CREATED)
    
@csrf_exempt
@api_view(['GET','POST'])
def login(request):

    serializer = UserSerializer(data=request.data)
    serializer.is_valid()
    
    user = authenticate(username=serializer.data["username"], password=serializer.data["password"])

    if user:
        user_data = {"username":request.data["username"],"password": request.data["password"]}
        token = requests.post("http://127.0.0.1:8000/token/", data=user_data)

        #analise de saldo***********************************************************************************
        user_id = User.objects.filter(username=serializer.data["username"]).first().id
        bancario = Bancario.objects.filter(id_usuario_id=user_id).first()

        mes_saldo = ((str(bancario.date)).split("-"))[1]
        ano_saldo = ((str(bancario.date)).split("-"))[2]
        mes_atual = ((str(datetime.date.today())).split("-"))[1]
        ano_atual = ((str(datetime.date.today())).split("-"))[2]

        if (mes_saldo != mes_atual):
            saldo = Saldos.objects.create(id_bancario_id=bancario.id, date=bancario.date, saldo=bancario.saldo_atual)
        elif (ano_saldo != ano_atual):
            saldo = Saldos.objects.create(id_bancario_id=bancario.id, date=bancario.date, saldo=bancario.saldo_atual)
        else:
            print("MES IGUAL SALDO ATUAL MANTIDO")
        #****************************************************************************************************

        return HttpResponse(token)
    else:
        return HttpResponse(HTTPStatus.UNAUTHORIZED)

        

