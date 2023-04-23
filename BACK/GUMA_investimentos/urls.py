from django.contrib import admin
from django.urls import path, include
# from Gastos.views import GastoApiView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),



    #Usuario rotas
    path('auth/', include('Usuario.urls')),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),


    # API de Gastos
    path('api/gastos/', include('Gastos.urls')),

]
