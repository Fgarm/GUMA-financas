from django.urls import path

from .views import TagApiView

urlpatterns = [
    path('tag-per-user/', TagApiView.get_tags_user, name='minhas-tags'),
    # tags padrões não serão criadas e lidadas com por enquanto
    path('tag-by-id/', TagApiView.get_tag_id, name='minhas-tags'),
    path('criar-tag/', TagApiView.post_tags, name='criar-tag'),
    path('atualizar-tag/', TagApiView.put_tag, name='atualizar-tag'),
    path('deletar-tag/', TagApiView.delete_tag, name='deletar-tag'),
]