# Generated by Django 5.1 on 2024-08-23 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='patronymic',
            field=models.CharField(blank=True, default='==> not specified <==', max_length=20, verbose_name='Отчество'),
        ),
    ]
