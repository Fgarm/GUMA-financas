from django.urls import path

from .views import ManagerView

urlpatterns = [
    #cadastros
    path('get-recorrencias/', ManagerView.get_recorrencias_user, name='pegar-recor-user'),
    path('implementar-recorrencias/', ManagerView.implementar_recorrencia, name='implementa-recor'),
    path('criar-recorrencias/', ManagerView.criar_recorrencia, name='cria-recor'),
    ]