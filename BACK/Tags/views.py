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
    @api_view(['GET'])
    def get_tags_user (request): #pega as tags de um usuário e devolve elas
        if request.method == 'GET':
            tags = Tag.objects.filter(user=request.data["id"])
            serializer = TagSerializer(tags, context={'request': request}, many=True)
            return Response(serializer.data)
        
    @api_view(['GET'])
    def get_tag_id (request): #pega as tags com um id e devolve ela
        if request.method == 'GET':
            tags = Tag.objects.get(id=request.data["id"])
            serializer = TagSerializer(tags, context={'request': request}, many=False)
            return Response(serializer.data)
    
    @api_view(['POST'])
    def post_tags (request):
        if request.method == 'POST':
            data = {}
            data["categoria"] = request.data["categoria"]
            data["cor"] = request.data["cor"]
            
            
            user_id = User.objects.filter(username=request.data["user"]).first().id
            print(user_id)
            if not user_id:
                return Response(HTTPStatus.BAD_REQUEST)
            
            data["user"] = user_id
            tag_existente = Tag.objects.filter(categoria=request.data["categoria"])
            if tag_existente:
                tag_existente = tag_existente.filter(user=user_id)
                if tag_existente:
                    return Response(HTTPStatus.BAD_REQUEST)
                
            serializer = TagSerializer(data=data)                
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #explicar melhor os erros:
        #pode ser form errado ou pode ser por que o user já tem essa tag
        
    @api_view(['PUT'])
    def put_tag (request):
        try:
            id = request.data["id"]
            tag = Tag.objects.get(id=id)
        except Tag.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if request.method == 'PUT':
            data = {}
            data["categoria"] = request.data["categoria"]
            data["cor"] = request.data["cor"]
            data["user"] = request.data["user"]
            serializer = TagSerializer(tag, data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['DELETE'])
    def delete_tag (request):
        try:
            id = request.data["id"]
            tag = Tag.objects.get(id=id)
        except Tag.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'DELETE':
            tag.delete()
            return Response(status=status.HTTP_202_ACCEPTED)