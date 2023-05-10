# Generated by Django 4.1.7 on 2023-05-10 03:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Grupos', '0005_grupogasto_user_gastos_grupo_usuario'),
    ]

    operations = [
        migrations.AddField(
            model_name='gastos_grupo',
            name='id_grupo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Grupos.grupo'),
        ),
        migrations.AddField(
            model_name='itens',
            name='id_GastosGrupo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Grupos.gastos_grupo'),
        ),
    ]
