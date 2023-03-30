from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import AnimalViewSet


router = DefaultRouter()
router.register(r'usuarios', AnimalViewSet)

urlpatterns = [
   # path('', views.index, name='index'),
    path('', include(router.urls)),

]
