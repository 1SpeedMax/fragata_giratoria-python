from django.db import models
from django.core.exceptions import ValidationError
from datetime import date


class UnidadMedida(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    
class Producto(models.Model):

    fecha_registro = models.DateField(auto_now_add=True)

    nombre = models.CharField(max_length=150)

    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock_actual = models.IntegerField()
    stock_minimo = models.IntegerField()

    unidad_medida = models.ForeignKey(
        UnidadMedida,
        on_delete=models.PROTECT
    )

    # ==========================
    # VALIDACIÓN COMO EN JAVA
    # ==========================
    def clean(self):
        if self.stock_actual < self.stock_minimo:
            raise ValidationError(
                "El stock actual no puede ser menor al stock mínimo"
            )

    def save(self, *args, **kwargs):
        self.full_clean()  # ejecuta clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre