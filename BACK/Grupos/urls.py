from django.urls import path

from .views import GrupoView

urlpatterns = [
    #cadastros
    path('cadastrar-grupo/', GrupoView.cadastrar_grupo, name='cadastrar-grupo'),
    path('cadastrar-gasto-grupo/', GrupoView.cadastrar_gasto_grupo, name='cadastrar-gasto-grupo'),
    path('cadastrar-item/', GrupoView.cadastrar_item, name='cadastrar-item'),
    path('cadastrar-item-associar-user/', GrupoView.cadastrar_item_associar_users, name='cadastrar-item-associar-user'),
    path('user-item-associacao/', GrupoView.associar_item_user, name='associar-item-user'),
    path('associar-user-grupoGastos/', GrupoView.associar_user_grupoGastos, name='associar-user-grupoGastos'),

    path('gerar-link/', GrupoView.gerar_link_grupo, name='gerar-link'),
    path('associar-usuario-grupo/', GrupoView.associar_usuario_grupo, name='associar-usuario-grupo'),

    #obeter dados
    path('grupos-usuario/', GrupoView.grupos_user, name='usuario-grupo'), #retorna grupos de um usuario
    path('usuarios-grupo/', GrupoView.usuarios_grupo, name='usuario-grupo'), #retorna usuarios de um grupo
    path('gastos-grupo/', GrupoView.gastos_grupo, name='gastos-grupo'), #retornas os gastos de uma grupo
    path('itens-gastos/', GrupoView.itens_gasto, name='itens-gastos'), #retornas todos os itens de um gastos
    path('peso-user-item/', GrupoView.peso_user_item, name='peso-user-item'), #retorna os peso e usuario de cada item
    path('usuario-em-gasto/', GrupoView.usuarios_em_gastos, name='usuario-em-gasto'), #retornar usuarios de uma conta
]
