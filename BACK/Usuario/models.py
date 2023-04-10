from django.db import models

# Create your models here.
class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    sobrenome = models.CharField(max_length=255)
    email = models.EmailField(primary_key=True)
    senha = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

        def __str__(self):
            return self.nome
        
    