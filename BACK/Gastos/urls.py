from django.urls import path

from .views import GastoApiView

urlpatterns = [
    path('meus-gastos/', GastoApiView.get_gastos, name='meus-gastos'),
    path('gastos-per-tag/', GastoApiView.pegar_gasto_tag, name='gastos-da-tag'),
    path('criar-gasto/', GastoApiView.post_gastos, name='criar-gasto'),
    path('atualizar-gasto/', GastoApiView.put_gasto, name='atualizar-gasto'),
    path('deletar-gasto/', GastoApiView.delete_gasto, name='deletar-gasto'),
    path('obter-gasto/', GastoApiView.get_gasto_username, name='obter-gasto')
]
