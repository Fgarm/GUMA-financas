from django.urls import path

from .views import GrupoApiView

urlpatterns = [
    path('grupo-cadastrar/', GrupoApiView.cadastrar, name='cadastrar-grupo'),
    
    ]