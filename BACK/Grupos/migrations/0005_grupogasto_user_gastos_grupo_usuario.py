# Generated by Django 4.1.7 on 2023-05-10 02:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Grupos', '0004_alter_itens_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='GrupoGasto_User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pago', models.BooleanField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Grupos.gastos_grupo')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'GrupoGasto_User',
                'verbose_name_plural': 'GrupoGastos_Users',
            },
        ),
        migrations.AddField(
            model_name='gastos_grupo',
            name='usuario',
            field=models.ManyToManyField(related_name='GrupoGasto_User', through='Grupos.GrupoGasto_User', to=settings.AUTH_USER_MODEL),
        ),
    ]
