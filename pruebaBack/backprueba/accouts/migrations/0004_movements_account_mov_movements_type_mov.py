# Generated by Django 4.2.1 on 2023-06-04 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accouts', '0003_account_last_login'),
    ]

    operations = [
        migrations.AddField(
            model_name='movements',
            name='account_mov',
            field=models.CharField(default=0, max_length=20),
        ),
        migrations.AddField(
            model_name='movements',
            name='type_mov',
            field=models.CharField(default=0, max_length=4),
        ),
    ]
