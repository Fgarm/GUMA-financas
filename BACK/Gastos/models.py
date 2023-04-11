from django.db import models

class Gasto(models.Model):
    nome = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=9, decimal_places=2) # vi que DecimalField pode ser bom para trabalhar com dinheiro, discutir  
    data = models.DateField()
    pago = models.BooleanField(default=False)
