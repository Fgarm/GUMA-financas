from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django


def cadastro (request):
    if request.method == "GET":
        return render(request, 'cadastro.html')
    else:
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
    
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
    

def login(request):
    if request.method == "GET":
        return render(request, 'login.html')
    else:
        username = request.POST.get('username')
        senha = request.POST.get('senha')

        user = authenticate(username=username, password=senha)

        if user:
            login_django(request, user)
            return HttpResponse("autenticado")
        else:
            return HttpResponse("Email ou senha invalido")
        
def vips(request):
    if request.user.is_authenticated:
        return HttpResponse('Entrou na area VIP')
    else: 
        return HttpResponse('Nao é VIP')
