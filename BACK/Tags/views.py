from django.shortcuts import render
from .models import Tag
from .serializers import TagSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from http import HTTPStatus
from django.http import HttpRequest

class TagApiView(APIView):
    @api_view(['POST'])
    def get_tags_user (request): #pega as tags de um usuário e devolve elas
        if request.method == 'POST':
            try:
                user = User.objects.get(username=request.data["user"])
            except User.DoesNotExist:
                return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
            except User.MultipleObjectsReturned:
                return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
            
            tags = Tag.objects.filter(user=user.username)
            serializer = TagSerializer(tags, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        

        
    @api_view(['POST'])
    def get_tag_id (request): #pega as tags com um id e devolve ela
        if request.method == 'POST':
            try:
                tags = Tag.objects.get(id=request.data["id"])
            except Tag.DoesNotExist:
                return Response("Tag inexistente", status=status.HTTP_404_NOT_FOUND)
            serializer = TagSerializer(tags, context={'request': request}, many=False)
            return Response(serializer.data)
    
    @api_view(['POST'])
    def post_tags (request):
        if request.method == 'POST':
            data = {}
            data["categoria"] = request.data["categoria"]
            data["cor"] = request.data["cor"]
            try:
                user = User.objects.get(username=request.data["user"])
                data["user"] = user.username
            except User.DoesNotExist:
                return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
            except User.MultipleObjectsReturned:
                return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)

            
            
            try:
                Tag.objects.get(categoria=data["categoria"], user=user.username)
                return Response("EXISTE OUTRA TAG COM ESSE NOME", status=status.HTTP_400_BAD_REQUEST)
            except Tag.DoesNotExist:
                pass
            except Tag.MultipleObjectsReturned:
                return Response("EXISTE OUTRAs TAGs COM ESSE NOME", status=status.HTTP_400_BAD_REQUEST)
                
            serializer = TagSerializer(data=data)                
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['PUT'])
    def atualizar_tag (request):
        data = {}
        try:
            user = User.objects.get(username=request.data["user"])
            data["user"] = user.username
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        try:
            data["categoria"] = request.data["categoria"]
            tag = Tag.objects.get(categoria=data["categoria"], user=user.username)
        except Tag.DoesNotExist:
            return Response("Não existe essa tag desse usuário", status=status.HTTP_404_NOT_FOUND)
        except Tag.MultipleObjectsReturned:
            return Response("EXISTE OUTRAs TAGs COM ESSE NOME", status=status.HTTP_400_BAD_REQUEST)
        if "novo_nome" in request.data:
            data["categoria"] = request.data["novo_nome"]
        if "cor" in request.data:
            data["cor"] = request.data["cor"]
        else:
            data["cor"] = tag.cor
        if request.method == 'PUT':
            serializer = TagSerializer(tag, data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['DELETE'])
    def delete_tag (request):
        try:
            user = User.objects.get(username=request.data["user"])
        except User.DoesNotExist:
            return Response("Username incorreto ou inexistente", status=status.HTTP_404_NOT_FOUND)
        except User.MultipleObjectsReturned:
            return Response("Há muitos usuários com msm username", status=HTTPStatus.BAD_REQUEST)
        try:
            tag = Tag.objects.get(categoria=request.data["categoria"], user=user.username)
        except Tag.DoesNotExist:
            return Response("Não existe essa tag desse usuário", status=status.HTTP_404_NOT_FOUND)
        except Tag.MultipleObjectsReturned:
            #talvez nesse caso deveria só excluir todas tbm pra ser honesto
            return Response("EXISTE OUTRAs TAGs COM ESSE NOME", status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'DELETE':
            tag.delete()
            #TODO: Deletar tags dos gastos que tem essa tag
            return Response("tag deleted", status=status.HTTP_202_ACCEPTED)