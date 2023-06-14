import datetime
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Bancario.models import Bancario, Saldos
from rest_framework.response import Response
from Gastos.models import Gasto
from rest_framework import status
import datetime


class BancarioView(APIView):
    @api_view(['POST'])
    def add_saldo(request):
        request.data["saldo"] = str(request.data["saldo"]).replace(",", ".")
        
        try:
            request.data["saldo"] = float(request.data["saldo"])
        except ValueError:
            return Response(f"Nao aceitamos Banana", status=status.HTTP_400_BAD_REQUEST)
   
        try:
            usuario_id = User.objects.filter(username=request.data["username"]).first().id
        except:
            return Response(f"Usuaario nao encontrado", status=status.HTTP_404_NOT_FOUND)
        
        try:
            bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
        except:
            return Response(f"Conta nao Cadastrada", status=status.HTTP_417_EXPECTATION_FAILED)
        
        Saldos.objects.create(id_bancario_id=bancario.id, date=datetime.datetime.today(), saldo=float(bancario.saldo_atual) + request.data["saldo"], valor=request.data["saldo"])
        bancario.saldo_atual = float(bancario.saldo_atual) + request.data["saldo"]
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
    
    # @api_view(['POST'])
    # def extrato_saldos(request):
    #     usuario_id = User.objects.filter(username=request.data["username"]).first().id
    #     bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
    #     saldos_list = Saldos.objects.filter(id_bancario_id=bancario.id)

    #     saldos_list = list(saldos_list)
        
    #     saldos_list.sort(key=lambda data : data.date, reverse=True) #Complexidade Nlol(n) ta safe 
        
    #     response_saldo = list()
    #     for saldo in saldos_list:

    #         r_dict = {"saldo": saldo.saldo, "data":saldo.date, "valor":saldo.valor}

    #         response_saldo.append(r_dict)


    #     return Response(response_saldo,status=status.HTTP_200_OK)
    
    @api_view(['POST'])
    def extrato_saldos(request):
        user_id = User.objects.filter(username=request.data["username"]).first().id
        gastos_list = Gasto.objects.filter(user_id=request.data["username"])
        bancario = Bancario.objects.filter(id_usuario_id=user_id).first()
        saldos_list = Saldos.objects.filter(id_bancario_id=bancario.id)

        match_array = list()
        for gasto in gastos_list:
            data = str(gasto.data).split("-")
            date_time = datetime.datetime(int(data[0]), int(data[1]), int(data[2]), 0, 0, 0)
            dt_aware = date_time.replace(tzinfo=datetime.timezone.utc)

            gasto_dict = {"nome": gasto.nome, "valor": gasto.valor, "data": dt_aware, "tag": gasto.tag}
            match_array.append(gasto_dict)

        for saldo in saldos_list:
            saldo_dict = {"nome": "Entrada", "valor": saldo.saldo, "data": saldo.date, "tag": "Entrada"}
            match_array.append(saldo_dict)

        match_array.sort(key=lambda x : x["data"])

        for a in match_array:
            print(a)
        

        return Response(status=status.HTTP_200_OK)
    


        