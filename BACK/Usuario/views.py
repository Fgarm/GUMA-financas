from datetime import datetime, timedelta
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from Usuario.serializer import UserSerializer


@csrf_exempt
@api_view(['GET','POST'])
def cadastro (request):
    print()
    print(request.data)
    print()
    if request.method == "GET":
        return render(request, 'cadastro.html')
    else:
        serializer = UserSerializer(data=request.data)
        serializer.is_valid()
    
        user = User.objects.filter(username=serializer["username"]).first()

        if user:
            return HttpResponse('Já existe um User com esse nome')
        
        user = User.objects.create_user(
            username=serializer.data["username"], 
            email=serializer.data["email"], 
            password=serializer.data["password"]
        )

        user.first_name = serializer.data["first_name"]
        user.last_name = serializer.data["last_name"]
        user.save()

        return HttpResponse('Usuario cadastrado com sucesso')
    
@csrf_exempt
@api_view(['GET','POST'])
def login(request):
    if request.method == "GET":
        return render(request, 'login.html')
    else:
        serializer = UserSerializer(data=request.data)
        serializer.is_valid()
        
        user = authenticate(username=serializer.data["username"], password=serializer.data["password"])

        if user:
            #user_data = {"username":"admin","password": "admin"}
            #token = requests.post("http://127.0.0.1:8000/token/", data=user_data)
            #print(token.json())

            response = HttpResponse("Usuario atenticado")
            #expires = datetime.now() + timedelta(days=30)
            #response.set_cookie(token, serializer.data["username"], expires=expires)
            return response
        else:
            return HttpResponse("Usuario ou Senha Invalidos")
        

