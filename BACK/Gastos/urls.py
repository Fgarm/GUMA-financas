from django.urls import path

from .views import GastoApiView

urlpatterns = [
    path('gastos/', GastoApiView.as_view(), name='gastos'),
]
