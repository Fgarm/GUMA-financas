from django.conf import settings
from django.db import models
from Tags.models import Tag

class Gasto(models.Model):
    nome = models.CharField(max_length=255)
    valor = models.FloatField() # vi que DecimalField pode ser bom para trabalhar com dinheiro, discutir  
    data = models.DateField()
    pago = models.BooleanField(default=False)
    tag = models.ForeignKey(Tag, null=True, on_delete=models.SET_NULL, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = "Gasto"
        verbose_name_plural = "Gastos"

        def __str__(self):
            return self.nome
