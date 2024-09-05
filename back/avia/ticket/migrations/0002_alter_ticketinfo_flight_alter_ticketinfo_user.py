# Generated by Django 5.1 on 2024-08-24 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticketinfo',
            name='flight',
            field=models.CharField(default='', max_length=64, verbose_name='Идентификатор рейса'),
        ),
        migrations.AlterField(
            model_name='ticketinfo',
            name='user',
            field=models.CharField(default='', max_length=150, verbose_name='Имя пользователя'),
        ),
    ]
