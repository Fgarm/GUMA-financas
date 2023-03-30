# from django.shortcuts import render
# Create your views here.

from django.http import HttpResponse
from rest_framework import viewsets
from .models import Animal, Tutor
from .serializers import AnimalSerializer


def index(request):
    return HttpResponse("<h1>Criando título</h1>")


class AnimalViewSet(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer 
    queryset = Animal.objects.all()
    