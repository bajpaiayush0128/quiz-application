# Generated by Django 3.2.6 on 2024-05-30 09:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_api', '0001_createdUserModelAndRole'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='quiz_api.role'),
        ),
    ]
