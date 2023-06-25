from django.db import models
from django.conf import settings
from django.db import models
from Tags.models import Tag

# Create your models here.

class MovimentacaoManager(models.Model):
    nome = models.CharField(max_length=255, null=True, blank=True)
    valor = models.FloatField()
    data = models.DateTimeField()
    pago = models.BooleanField(default=False, null=True, blank=True)
    tag = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, to_field="username", null=True, on_delete=models.SET_NULL)
    atualizacao= models.DateTimeField() # utlima data que foi atualizado o saldo
    frequencia = models.CharField(max_length=1) #D, S, M, A para dia, semana, mes e ano
    tipo = models.CharField(max_length=1) #G para gastos, S para saldos

# Para cadastrar um saldo novo precisa do valor (enviado como "saldo") e precisa do username
# Para cadastrar um gasto novo precisa de todos os campos acima, ent saldo está enquadrado no gasto

    class Meta:
        verbose_name = "Recorrente"
        verbose_name_plural = "Recorrentes"

        def __str__(self):
            return self.nome
        
# Movimentação manager é uma aplicação que vai servir de forma meio meta:
# ela será usada para gerenciar conjuntos de gastos.
# funções esperadas:
# gerenciar a criação e manutenção (possivel atualização caso necessário) de gastos recorrentes
# criar gastos na área pessoal de um usuário após a criação dessa movimentação do user no grupo
# 
# Para isso, deverá ser mantido:
# A data de criação da movimentação. A frequencia de criação de novos, quais foram criados (para possíveis atualizações dos mesmos)
# O valor atual da movimentação


# De forma mais concreta:

# Para movimentações recorrentes: 
# O valor da movimentação (para criar o gasto)
# A frequencia da movimentação (pra adicionar uma nova quando necessário)
# A ultima atualização das movimentações (pra saber quantas tem que adicionar desde a ultima)
# // Não é necessário poder atualizar as passadas, então seria isso
# caso for atualizar:
# guardar quais são as movimentações geradas dessa forma (para atualizar elas pra qualquer eventualidade)
# atualizar os valores não faz sentido. Atualizar o nome não sei se compensa a feature. Outros dados também não compensa
# poder excluir os gastos gerados por uma recorrencia é interessante, mas sla

# Para gerar gastos dos do grupo:

# a periodicidade vai ser 0
# ele precisa atualizar o gasto individual baseado em qualquer mudança no do grupo
# ele não precisa guardar frequencia
# ele não precisa guardar as ultimas atualizações (vão ser feitas sempre que editarem o gasto)
# ele precisa guardar a movimentação gerada
# ele precisa guardar o user
# os gastos do grupo precisam guardar os gastos pessoais para a edição dele