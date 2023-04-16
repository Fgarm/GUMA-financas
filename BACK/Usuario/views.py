from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['GET','POST'])
def cadastro (request):
    print()
    print(request.data)
    print()
    if request.method == "GET":
        return render(request, 'cadastro.html')
    else:
        username = request.data['username']
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        senha = request.data['senha']
    
        user = User.objects.filter(username=username).first()

        if user:
            return HttpResponse('Já existe um User com esse nome')
        
        user = User.objects.create_user(
            username=username, 
            email=email, 
            password=senha
        )

        user.first_name = first_name
        user.last_name = last_name
        user.save()

        return HttpResponse('Usuario cadastrado com sucesso')
    
@csrf_exempt
@api_view(['GET','POST'])
def login(request):
    if request.method == "GET":
        return render(request, 'login.html')
    else:
        username = request.data['username']
        senha = request.data['senha']
        print(request.data)

        user = authenticate(username=username, password=senha)
        print(user)
        if user:
            login_django(request, user)
            print("atenticado")
            return HttpResponse("autenticado")
        else:
            print("nao atenticado")
            return HttpResponse("Email ou senha invalido")


def vips(request):
    if request.user.is_authenticated:
        return HttpResponse('Entrou na area VIP')
    else: 
        return HttpResponse('Nao é VIP')
