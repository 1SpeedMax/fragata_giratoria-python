from django.db import models
from productos.models import Producto
from datetime import date
from django.utils import timezone
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
    )
    
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    total = models.DecimalField(max_digits=38, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=[('ACTIVA', 'Activa'), ('ANULADA', 'Anulada')], default='ACTIVA')
    
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
        total_str = f"${self.total:,.2f}" if self.total else "$0.00"
        return f"{empresa_str} - {fecha_str} - {total_str}"
    
    def save(self, *args, **kwargs):
        # Si no hay fecha, asignar hoy
        if not self.fecha:
            self.fecha = date.today()
        
        # Validar que la fecha no sea mayor a mañana
        from datetime import timedelta
        hoy = date.today()
        manana = hoy + timedelta(days=1)
        if self.fecha and self.fecha > manana:
            # Forzar la fecha a hoy si es inválida (evita errores en runtime)
            self.fecha = hoy

        # Si total es None, poner 0.00
        if self.total is None:
            self.total = Decimal('0.00')
        
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
        # Calcular subtotal y luego guardar
        try:
            self.subtotal = (Decimal(self.cantidad) * Decimal(self.precio_unitario))
        except Exception:
            self.subtotal = Decimal('0.00')
        super().save(*args, **kwargs)
    
    def __str__(self):
        prod = self.producto.nombre if hasattr(self.producto, 'nombre') else str(self.producto)
        return f"{prod} x{self.cantidad} - {self.subtotal or 0}"