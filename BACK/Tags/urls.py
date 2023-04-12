from django.urls import path

from .views import TagApiView

urlpatterns = [
    path('tags/', TagApiView.as_view(), name='tag'),
]