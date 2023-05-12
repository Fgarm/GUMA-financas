from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.conf import settings

class Tag(models.Model):
    categoria = models.CharField(max_length=255)
    cor = models.CharField(max_length=6)
    #RRGGBB tag em hexa (sujeito a mudanças para conveniencia)
    #user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,to_field="username", on_delete=models.CASCADE, null=True)
    #preencher a tabela de tag padrão na criação da conta de usuário
    #ou usar as tags padrão como NULL, e puxar elas sempre além das de cada usuário
    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

        def __str__(self):
            return self.nome
    