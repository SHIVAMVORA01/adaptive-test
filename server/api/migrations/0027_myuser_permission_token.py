# Generated by Django 4.0 on 2022-03-03 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_auto_20220302_1851'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='permission_token',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
    ]
