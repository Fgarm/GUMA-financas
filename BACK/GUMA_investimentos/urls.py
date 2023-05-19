from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),



    # Rotas Usuario
    path('auth/', include('Usuario.urls')),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),


    # Rotas Gastos
    path('api/gastos/', include('Gastos.urls')),
    
    # Rotas Tags
    path('tags/', include('Tags.urls')),

    # Rotas Grupo
    path('grupos/', include('Grupos.urls'))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
