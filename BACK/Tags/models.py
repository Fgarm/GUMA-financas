from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    categoria = models.CharField(max_length=255)
    cor = models.CharField(max_length=6)
    #RRGGBB tag em hexa (sujeito a mudanças para conveniencia)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    #preencher a tabela de tag padrão na criação da conta de usuário
    #ou usar as tags padrão como NULL, e puxar elas sempre além das de cada usuário
    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

        def __str__(self):
            return self.nome
    