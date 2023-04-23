from datetime import datetime, timedelta
import json
from django.http import HttpResponse
from http import HTTPStatus
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from Usuario.serializer import UserSerializer
import requests


@csrf_exempt
@api_view(['GET','POST'])
def cadastro (request):
    print()
    print(request.data)
    print()


    serializer = UserSerializer(data=request.data)
    if (not serializer.is_valid()): return HttpResponse(HTTPStatus.BAD_REQUEST)

    user = User.objects.filter(username=serializer["username"]).first()

    if user:
        return HttpResponse(HTTPStatus.CONFLICT)
    
    user = User.objects.create_user(
        username=serializer.data["username"], 
        email=serializer.data["email"], 
        password=serializer.data["password"]
    )

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
        user_data = {"username":"admin","password": "admin"}
        token = requests.post("http://127.0.0.1:8000/token/", data=user_data)

        return HttpResponse(token)
    else:
        return HttpResponse(HTTPStatus.UNAUTHORIZED)
        

