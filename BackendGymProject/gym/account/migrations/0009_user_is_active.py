# Generated by Django 4.2.4 on 2023-10-21 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_gym_address_gym_linkfacebook_gym_linkinstagram'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]