from django.urls import path

from .views import GrupoView

urlpatterns = [
    path('cadastrar-grupo/', GrupoView.cadastrar_grupo, name='cadastrar-grupo'),
    path('cadastrar-gasto-grupo/', GrupoView.cadastrar_gasto_grupo, name='cadastrar-gasto-grupo'),
    path('cadastrar-item/', GrupoView.cadastrar_item, name='cadastrar-item'),
    path('user-item-associacao/', GrupoView.associar_item_user, name='associar-item-user'),
    path('associar-user-grupoGastos/', GrupoView.associar_user_grupoGastos, name='associar-user-grupoGastos'),
    path('cadastrar-usuario-grupo/', GrupoView.cadastrar_usuario_grupo, name='cadastrar-usuario-grupo'),
    path('gerar-link/', GrupoView.gerar_link_grupo, name='gerar-link'),
    path('entrar-com-link-grupo/', GrupoView.entrar_com_link, name='Entrar com link')
]
