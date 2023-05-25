import datetime
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Bancario.models import Bancario, Saldos
from rest_framework.response import Response
from rest_framework import status
import datetime
class BancarioView(APIView):
    @api_view(['POST'])
    def add_saldo(request):
        if(type(request.data["saldo"]) == type("")):
            return Response(f"TIPO DE SALDO INVALIDO, SALDO NECESSITA SER NUMBER", status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario_id = User.objects.filter(username=request.data["username"]).first().id
        except:
            return Response(f"Usuaario nao encontrado", status=status.HTTP_404_NOT_FOUND)
        
        try:
            bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
        except:
            return Response(f"Conta nao Cadastrada", status=status.HTTP_417_EXPECTATION_FAILED)
        
        Saldos.objects.create(id_bancario_id=bancario.id, date=datetime.date.today(), saldo=bancario.saldo_atual)
        bancario.saldo_atual = bancario.saldo_atual + request.data["saldo"]
        bancario.save()

        return Response(f"Saldo Atual: {bancario.saldo_atual}", status=status.HTTP_200_OK)
    

    @api_view(['POST'])
    def saldo_atual(request):
        try:
            usuario_id = User.objects.filter(username=request.data["username"]).first().id
        except:
            return Response(f"Usuaario nao encontrado", status=status.HTTP_404_NOT_FOUND)
        
        try:
            bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
        except:
            return Response(f"Conta nao Cadastrada", status=status.HTTP_417_EXPECTATION_FAILED)
        
        return Response(bancario.saldo_atual, status=status.HTTP_200_OK)
    
    @api_view(['POST'])
    def extrato_saldos(request):
        usuario_id = User.objects.filter(username=request.data["username"]).first().id
        bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
        saldos_list = Saldos.objects.filter(id_bancario_id=bancario.id)

        saldos_list = list(saldos_list)
        
        saldos_list.sort(key=lambda data : data.date, reverse=True) #Complexidade Nlol(n) ta safe 
        
        response_saldo = list()
        response_saldo.append({"saldo": bancario.saldo_atual, "data":bancario.date})
        for saldo in saldos_list:
            r_dict = {"saldo": saldo.saldo, "data":saldo.date}
            response_saldo.append(r_dict)


        return Response(response_saldo,status=status.HTTP_200_OK)