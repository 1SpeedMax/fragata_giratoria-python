from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0003_alter_producto_cantidad'),
    ]

    operations = [
        migrations.AddField(
            model_name='unidadmedida',
            name='abreviatura',
            field=models.CharField(
                blank=True,
                help_text='Ej: kg, L, und',
                max_length=10,
                verbose_name='Abreviatura',
            ),
        ),
        migrations.AlterModelOptions(
            name='unidadmedida',
            options={
                'ordering': ['nombre'],
                'verbose_name': 'Unidad de medida',
                'verbose_name_plural': 'Unidades de medida',
            },
        ),
    ]
