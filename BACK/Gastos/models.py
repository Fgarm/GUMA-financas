from django.conf import settings
from django.db import models
from Tags.models import Tag

class Gasto(models.Model):
    nome = models.CharField(max_length=255)
    valor = models.FloatField() # vi que DecimalField pode ser bom para trabalhar com dinheiro, discutir  
    data = models.DateField()
    pago = models.BooleanField(default=False)
    #tag = models.ForeignKey(Tag, null=True, to_field="categoria", on_delete=models.SET_NULL, blank=True)
    # o codigo acima está comentado por que não funciona por que categoria não é única
    # a verificação se a tag existe fica a cargo das funções
    # e deletar as tags do gasto do user dessa tag tbm fica
    tag = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, to_field="username", null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = "Gasto"
        verbose_name_plural = "Gastos"

        def __str__(self):
            return self.nome
