# Generated by Django 5.2 on 2025-05-10 12:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_employee_role_employee_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesorder',
            name='client_status',
            field=models.CharField(choices=[('pending', 'قيد الانتظار'), ('rejected', 'رفض'), ('pending_confirmation', 'جاري التأكيد'), ('confirmed', 'تم التأكد')], default='pending', max_length=20),
        ),
        migrations.AddField(
            model_name='salesorder',
            name='modified_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='salesinvoicedetail',
            name='quantity',
            field=models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
