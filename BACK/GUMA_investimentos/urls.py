from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),



    #Usuario rotas
    path('auth/', include('Usuario.urls')),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),


    # API de Gastos
    path('api/gastos/', include('Gastos.urls')),
    
    # Caminho Tags
    path('tags/', include('Tags.urls')),

    #Rotas de Gastos

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
