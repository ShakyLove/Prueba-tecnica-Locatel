# Generated by Django 4.2.1 on 2023-06-03 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accouts', '0002_movements_value_mov'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='last_login',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
