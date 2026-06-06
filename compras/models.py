from django.db import models
from productos.models import Producto
from datetime import date
from decimal import Decimal


class Compra(models.Model):
    id = models.BigAutoField(primary_key=True)
    
    # NUEVO CAMPO EMPRESA
    empresa = models.CharField(
        max_length=100, 
        null=False, 
        blank=False,
        verbose_name="Nombre de la Empresa/Proveedor",
        help_text="Nombre del proveedor o empresa a quien se le compra",
        default="Proveedor General"
    )
    
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    total = models.DecimalField(max_digits=38, decimal_places=2, null=True, blank=True)
    
    # Campos adicionales para auditoría
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)  

    class Meta:
        db_table = 'compras'
        ordering = ['-fecha']
        verbose_name = "Compra"
        verbose_name_plural = "Compras"

    def __str__(self):
        empresa_str = self.empresa if self.empresa else "Sin proveedor"
        fecha_str = self.fecha.strftime('%d/%m/%Y') if self.fecha else "Sin fecha"
        total_str = f"${self.total:,.2f}" if self.total else "$0"
        return f"{empresa_str} - {fecha_str} - {total_str}"
    
    def save(self, *args, **kwargs):
        if not self.fecha:
            self.fecha = date.today()
        
        from datetime import timedelta
        hoy = date.today()
        manana = hoy + timedelta(days=1)
        
        if self.fecha and self.fecha > manana:
            raise ValueError("❌ No se puede guardar una compra con fecha posterior a mañana")
        
        if self.total is None:
            self.total = Decimal('0')
        
        super().save(*args, **kwargs)


class CompraDetalle(models.Model):
    id = models.BigAutoField(primary_key=True)
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'compra_detalle'
        verbose_name = "Detalle de Compra"
        verbose_name_plural = "Detalles de Compras"

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades"