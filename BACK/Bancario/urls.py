from django.urls import path

from Bancario.views import BancarioView

urlpatterns = [
    path('add-saldo/', BancarioView.add_saldo, name='add-saldo'), 
    path('obter-saldo/', BancarioView.saldo_atual, name='add-saldo'), 
    path('extrato-saldo/', BancarioView.extrato_saldos, name='extrato-saldo'), 
    path('saldo-atual/', BancarioView.saldo_atual, name='extrato-saldo'), 
]
