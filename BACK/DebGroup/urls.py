from django.urls import path

from DebGroup.views import Debitosview

urlpatterns = [
    path('obter-devedores/', Debitosview.obter_devedores, name='obeter-devedores'),
    path('obter-recebedores/', Debitosview.obter_recebedores, name='obeter-devedores'), 
]