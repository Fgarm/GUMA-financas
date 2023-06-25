from django.urls import path

from .views import ManagerView

urlpatterns = [
    #cadastros
    path('get-recorrencias/', ManagerView.get_recorrencias_user, name='pegar-recor-user'),
    path('implementar-recorrencias/', ManagerView.implementar_recorrencia, name='implementa-recor'),
    path('criar-recorrencias/', ManagerView.criar_recorrencia, name='cria-recor'),
    path('apagar-recorrencia/', ManagerView.apagar_recorrencia, name='apaga-recor'),
    ]

'''Exemplo JSON: http://127.0.0.1:8000/recorrencia/implementar-recorrencias/
{
    "user" : "fgarm"
}

Exemplo JSON: http://127.0.0.1:8000/recorrencia/criar-recorrencias/
{
    "frequencia" : "Semanal",
    "user": "fgarm",
    "data": "2023-03-26",
    "nome": "exemplo",
    "tipo": "gasto",
    "pago": true,
    "valor": 7.00
}
'''