import datetime
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from Bancario.models import Bancario, Saldos
from rest_framework.response import Response
from Gastos.models import Gasto
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
        
        try:
            saldo_nome = str(dados["nome"])
            if saldo_nome == None or len(saldo_nome) == 0: dados["nome"] = "Entrada"
        except KeyError:
            dados["nome"] = "Entrada"
        if "data" in dados:
            data_comeco, data_final, timezone = str(dados["data"]).split()
            data_comeco = str(data_comeco).split("-")
            data_final = [int(coisa.split(".")[0]) for coisa in data_final.split(":")]
            dados["data"] = dt.datetime(int(data_comeco[0]), int(data_comeco[1]), int(data_comeco[2]), data_final[0], data_final[1], data_final[2])
            # dados["data"] = dados["data"].replace(tzinfo=dt.timezone.utc)
            Saldos.objects.create(id_bancario_id=bancario.id, date=dados["data"], saldo=float(bancario.saldo_atual) + dados["saldo"], valor=dados["saldo"], nome=dados["nome"])
        else:
            Saldos.objects.create(id_bancario_id=bancario.id, date=datetime.datetime.today(), saldo=float(bancario.saldo_atual) + dados["saldo"], valor=dados["saldo"], nome=dados["nome"])
        bancario.saldo_atual = float(bancario.saldo_atual) + dados["saldo"]
        bancario.save()

        return Response(f"Saldo Atual: {bancario.saldo_atual}", status=status.HTTP_200_OK)
    
    
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

            gasto_dict = {"id": gasto.id ,"nome": gasto.nome, "valor": (gasto.valor * -1), "data": dt_aware, "tag": gasto.tag, "pago": gasto.pago}
            match_array.append(gasto_dict)

        for saldo in saldos_list:
            saldo_dict = {"id": saldo.id,"nome": saldo.nome, "valor": saldo.valor, "data": saldo.date, "tag": None, "pago": None}
            match_array.append(saldo_dict)

        match_array.sort(key=lambda x : x["data"])

        for a in match_array:
            print(a)
        

        return Response(match_array,status=status.HTTP_200_OK)
    
    @api_view(['POST'])
    def saldo_atual(request):
        user_id = User.objects.filter(username=request.data["username"]).first().id
        saldo = float(Bancario.objects.filter(id_usuario_id=user_id).first().saldo_atual)

        return Response(saldo ,status=status.HTTP_200_OK)
    


        