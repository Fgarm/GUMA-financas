from django.conf import settings
from django.db import models
from Grupos.models import Gastos_Grupo, Itens

class Debitos(models.Model):
    provedor = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="user_dono", on_delete=models.CASCADE, null=True)
    devedor = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="user_devedor", on_delete=models.CASCADE, null=True)
    valor = models.DecimalField(max_digits=20, decimal_places=2, blank=False, null=False)
    grupo_gasto = models.ForeignKey(Gastos_Grupo, on_delete=models.CASCADE, null=False)
    item = models.ForeignKey(Itens, on_delete=models.CASCADE, null=False)



