from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('platillos', '0002_auto_20260327_2143'),
    ]

    operations = [
        migrations.AlterField(
            model_name='platillo',
            name='imagen_url',
            field=models.CharField(
                blank=True,
                help_text='Ruta en static, ej: img/menu/Ceviche-Clásico.avif',
                max_length=500,
                verbose_name='Ruta de imagen',
            ),
        ),
    ]
