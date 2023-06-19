from uuid import uuid4
from django.conf import settings
from django.db import models

class Bancario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    saldo_atual = models.DecimalField(max_digits=20, decimal_places=2)
    date = models.DateField()

class Saldos(models.Model):
    nome = models.CharField(max_length=255, null=True)
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    id_bancario = models.ForeignKey(Bancario, on_delete=models.CASCADE, null=True)
    saldo = models.DecimalField(max_digits=20, decimal_places=2)
    date = models.DateTimeField()
    valor = models.DecimalField(max_digits=20, decimal_places=2, null=True)
