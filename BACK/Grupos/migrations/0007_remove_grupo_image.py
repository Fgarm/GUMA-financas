# Generated by Django 4.1.7 on 2023-05-14 22:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Grupos', '0006_gastos_grupo_id_grupo_itens_id_gastosgrupo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grupo',
            name='image',
        ),
    ]
