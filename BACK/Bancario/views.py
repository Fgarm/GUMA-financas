from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Bancario.models import Bancario, Saldos
from rest_framework.response import Response
from rest_framework import status
class BancarioView(APIView):
    @api_view(['POST'])
    def cadastrar_saldo(request):
        usuario_id = User.objects.filter(username=request.data["username"]).first().id

        bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()

        bancario.saldo_atual = bancario.saldo_atual + request.data["saldo"]
        bancario.save()

        Response(f"Saldo Atual: {bancario.saldo_atual}", status=status.HTTP_200_OK)
