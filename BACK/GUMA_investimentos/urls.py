from django.contrib import admin
from django.urls import path, include, re_path
from Gastos.views import GastoApiView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    #Gastos Rotas
    re_path(r'^api/gastos/$', GastoApiView.post_gastos),
    re_path(r'^api/gastos/([0-9])$', GastoApiView.delete_gasto),

    #Usuario rotas
    path('auth/', include('Usuario.urls')),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view())

]