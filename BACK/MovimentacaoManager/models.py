from django.db import models

# Create your models here.

# Movimentação manager é uma aplicação que vai servir de forma meio meta:
# ela será usada para gerenciar conjuntos de gastos.
# funções esperadas:
# gerenciar a criação e manutenção (possivel atualização caso necessário) de gastos recorrentes
# criar gastos na área pessoal de um usuário após a criação dessa movimentação do user no grupo
# 
# Para isso, deverá ser mantido:
# A data de criação da movimentação. A frequencia de criação de novos, quais foram criados (para possíveis atualizações dos mesmos)
# O valor atual da movimentação
