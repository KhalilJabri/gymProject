# Generated by Django 4.2.4 on 2023-09-29 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='created_at',
            field=models.DateField(default=None),
            preserve_default=False,
        ),
    ]
