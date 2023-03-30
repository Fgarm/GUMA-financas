from django.db import models


class Tutor(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11)
    data_nascimento = models.DateField('Data de nascimento')

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name_plural = 'Tutores'


class Animal(models.Model): # forma de que vai trabalhar com o banco de dados
    nome = models.CharField(max_length=50)
    raca = models.CharField(max_length=50)
    cor = models.CharField(max_length=10)
    data_nascimento = models.DateField('Data de nascimento')
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name_plural = 'Animais'

