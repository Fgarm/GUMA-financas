from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    sobrenome = models.CharField(max_length=255)
    email = models.EmailField(primary_key=True)
    senha = models.CharField(max_length=500)   #pode estourar de acordo com a hash, analisar
    
