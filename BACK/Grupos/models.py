from uuid import uuid4
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

def upload_image_book(instance, filename):
    return f"{instance.grupo_id}-{filename}"


class Grupo(models.Model):
    grupo_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    nome = models.CharField(max_length=255)
    descricao= models.TextField(blank=True)
    criador = models.IntegerField(blank=True, null=True)
    #image = models.ImageField(upload_to=upload_image_book, blank=True, null=True)

    usuario = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="group_user", through="Grupo_User")

    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"
    

class Gastos_Grupo(models.Model):
    grupoGasto_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    valor_total = models.DecimalField(max_digits=19, decimal_places=2, default=0)
    nome_gasto = models.CharField(max_length=255, null=True)
    provedor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    id_grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, null=True)

    usuario = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="GrupoGasto_User", through="GrupoGasto_User")

    class Meta:
        verbose_name = "Gasto_grupo"
        verbose_name_plural = "Gastos_grupos"

class Itens(models.Model):
    item_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    preco_unitario = models.DecimalField(max_digits=19, decimal_places=2)
    preco_total_item = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descricao = models.CharField(max_length=255, null=True)
    quantidade = models.IntegerField(default=1, blank=True)

    id_GastosGrupo = models.ForeignKey(Gastos_Grupo, on_delete=models.CASCADE, null=True)

    usuario = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="user_itens", through="Iten_User")

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Itens"

class GrupoGasto_User(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conta = models.ForeignKey(Gastos_Grupo, on_delete=models.CASCADE)
    pago = models.BooleanField(blank=False, null=False)

    class Meta:
        verbose_name = "GrupoGasto_User"
        verbose_name_plural = "GrupoGastos_Users"

class Iten_User(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Itens, on_delete=models.CASCADE)
    peso = models.DecimalField(max_digits=15, decimal_places=9)

    class Meta:
        verbose_name = "Item_Usuario"
        verbose_name_plural = "Itens_Usuarios"

class Grupo_User(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Grupo_User"
        verbose_name_plural = "Grupos_Users"




    

