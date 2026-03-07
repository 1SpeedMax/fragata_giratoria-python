from django.db import models
from productos.models import Producto

class Compra(models.Model):
    id = models.BigAutoField(primary_key=True)
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    total = models.DecimalField(max_digits=38, decimal_places=2, null=True, blank=True)
    
     # Campos adicionales para auditoría
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # Fecha de creación
    updated_at = models.DateTimeField(auto_now=True, null=True)  

    class Meta:
        db_table = 'compras'
        ordering = ['-fecha']

    def __str__(self):
        return f"Compra #{self.id} - {self.fecha} - ${self.total}"


class CompraDetalle(models.Model):
    """
    Tabla adicional sugerida para detalle de compras
    (No está en el script pero es necesaria para un sistema completo)
    """
    id = models.BigAutoField(primary_key=True)
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'compra_detalle'

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)