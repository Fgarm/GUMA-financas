import datetime
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Bancario.models import Bancario, Saldos
from Gastos.models import Gasto
from rest_framework.response import Response
from rest_framework import status
import datetime
import datetime as dt
from django.http import QueryDict
import json

class BancarioView(APIView):
    @api_view(['POST'])
    def add_saldo(request):
        dados = {}
        if isinstance(request.data, QueryDict):
            print("no bancario", request.data)
            dados = json.loads(list(request.data.keys())[0])
            print("dps de tratado", dados)
            try:
                dados["saldo"] = dados["valor"]
            except KeyError: 
                # confia precisa disso
                # não, eu também não sei pq
                dados["valor"] = dados["saldo"]
                dados["saldo"] = dados["valor"]
            dados["username"] = dados["user"]
            print("estando aqui dentro", dados)
        else:
            dados = request.data
        dados["saldo"] = str(dados["saldo"]).replace(",", ".")
        
        try:
            dados["saldo"] = float(dados["saldo"])
        except ValueError:
            return Response(f"Nao aceitamos Banana", status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario_id = User.objects.filter(username=dados["username"]).first().id
        except:
            return Response(f"Usuaario nao encontrado", status=status.HTTP_404_NOT_FOUND)
        
        try:
            bancario = Bancario.objects.filter(id_usuario_id=usuario_id).first()
        except:
            return Response(f"Conta nao Cadastrada", status=status.HTTP_417_EXPECTATION_FAILED)
        
        if "data" in dados:
            data_comeco, data_final, timezone = str(dados["data"]).split()
            data_comeco = str(data_comeco).split("-")
            data_final = [int(coisa.split(".")[0]) for coisa in data_final.split(":")]
            dados["data"] = dt.datetime(int(data_comeco[0]), int(data_comeco[1]), int(data_comeco[2]), data_final[0], data_final[1], data_final[2])
            dados["data"] = dados["data"].replace(tzinfo=dt.timezone.utc)
            Saldos.objects.create(id_bancario_id=bancario.id, date=dados["data"], saldo=float(bancario.saldo_atual) + dados["saldo"], valor=dados["saldo"])
        else:
            Saldos.objects.create(id_bancario_id=bancario.id, date=datetime.datetime.today(), saldo=float(bancario.saldo_atual) + dados["saldo"], valor=dados["saldo"])
        bancario.saldo_atual = float(bancario.saldo_atual) + dados["saldo"]
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
        for saldo in saldos_list:

            r_dict = {"saldo": saldo.saldo, "data":saldo.date, "valor":saldo.valor}

            response_saldo.append(r_dict)


        return Response(response_saldo,status=status.HTTP_200_OK)
    

    # #vou fazer ainda
    # @api_view(['POST'])
    # def extrato_saldos(request):
    #     gastos = Gasto.objects.filter(username=request.username)

    #     gastos.sort(key=lambda data : data.data, reverse=True)

    #     for gasto in gastos:
    #         print(f"{gasto.data} {gasto.nome}")
