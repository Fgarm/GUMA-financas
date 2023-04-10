from django.urls import path

from .views import UsuarioApiView

urlpatterns = [
    path('usuario/', UsuarioApiView.as_view(),  name='usuario'),
]