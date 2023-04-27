<h1 align="center">:money_with_wings: GUMA <br> Controle de Finanças e Investimentos </h1>

<p align="center">
Aplicação web desenvolvida conjuntamente nas disciplinas de Projeto Integrador e Engenharia de Software 1 do curso de Bacharelado em Ciência da Computação da UTFPR na qual tem como objetivo o gerenciamento financeiro, tanto individual, quanto coletivo para um grupo de pessoas.
</p>
<br>

### :green_circle: Como executar o Back-end
<br>

### Crie um Ambiente Virtual

```bash
python -m venv <venv_name>

# Ative-o, se estiver no Linux, por meio do comando
source <venv_name>/bin/activate

# Ou se estiver no Windows, por meio do comando
.\<venv_name>\Scripts\activate
```
<br>


### Instale as dependências do projeto

```bash
pip install -r requirements.txt
```
<br>


### Conexão com MySql e com servidor local <br>
    
- Crie um banco de dados pelo MySql.

- Crie um arquivo chamado `local_settings.py` dentro do diretório `BACK/GUMA_investimentos/` e adicione o código abaixo.

- OBS.: Lembre-se de modificar todos os campos necessários que estão listados abaixo de acordo com as configurações do seu banco de dados, como `NAME`, `USER`, `PASSWORD` e `PORT`.

```python
from GUMA_investimentos.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'guma_financas',
        'USER': 'bd_username',
        'PASSWORD': 'bd_user_password',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```
<br>


### Aplique as migrações no seu banco de dados por meio dos comandos

```bash
# Cria arquivos de migração com base nas alterações feitas nos models
make makemigrations

# Aplica essas migrações pendentes ao banco de dados
make migrate
```
<br>

### Finalmente, inicialize o servidor do Django que estará disponível na porta `8000` atrvés do comando

```bash
make runserver
```

<br><br>

### :mortar_board: Autores

<table style="flex-wrap: wrap; display: flex; align-items: center;  flex-direction: column;" ><tr>

<td align="center"><a href="https://github.com/Fgarm">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/69016293?v=4" width="100px;" alt=""/>
<br />
 <b>Guilherme Maturana</b></a>
 <a href="https://github.com/Fgarm" title="Repositorio Guilherme Maturana"></a>

RA: 2349353</td>


<td align="center"><a href="https://github.com/EdgarVeider">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/87232672?v=4" width="100px;" alt=""/>
<br />
 <b>Guilherme Matos
</b>
 </a> <a href="https://github.com/EdgarVeider" title="Repositorio Guilherme Matos"></a>

RA: 2349361</td>


<td align="center"><a href="https://github.com/GustavoMartinx">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/90780907?v=4" width="100px;" alt=""/>
<br />
 <b>Gustavo Martins</b>
 </a> <a href="https://github.com/GustavoMartinx" title="Repositorio Gustavo"></a>

RA: 2349370</td>

<td align="center"><a href="https://github.com/marcosdquadros">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/98984018?v=4" width="100px;" alt=""/>
<br />
 <b>Marcos Quadros
</b>
 </a> <a href="https://github.com/marcosdquadros" title="Repositorio Marcos Quadros"></a>

RA: 2380560</td>


<td align="center"><a href="https://github.com/thiagogquinto">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/95106865?v=4" width="100px;" alt=""/>
<br />
 <b>Thiago Gariani
</b>
 </a> <a href="https://github.com/thiagogquinto" title="Repositorio Thiago Gariani"></a>

RA: 2388898</td>

</tr></table>