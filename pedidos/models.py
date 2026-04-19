# pedidos/models.py

from django.db import models
from django.conf import settings
from platillos.models import Platillo

class Cliente(models.Model):
    TIPO_CHOICES = [
        ('DELIVERY', 'Delivery'),
        ('LOCAL', 'Local'),
    ]

    id_cliente = models.AutoField(primary_key=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    nombre = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, null=True, blank=True)

    class Meta:
        db_table = 'pedidos_cliente'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre or f"Cliente {self.id_cliente}"


class Pedido(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('ENVIADO', 'Enviado'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    # NUEVO: Estados de cocina
    ESTADO_COCINA_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PREPARACION', 'En preparación'),
        ('LISTO', 'Listo'),
        ('ENTREGADO', 'Entregado'),
    ]
    
    id_pedido = models.AutoField(primary_key=True)
    cantidad = models.IntegerField(null=True, blank=True)
    estado = models.CharField(max_length=255, null=True, blank=True, default='PENDIENTE')
    
    # NUEVO: Usar choices para estado_cocina
    estado_cocina = models.CharField(
        max_length=20, 
        choices=ESTADO_COCINA_CHOICES, 
        null=True, 
        blank=True, 
        default='PENDIENTE'
    )
    
    estado_mesero = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    id_adicional = models.IntegerField(null=True, blank=True)
    
    id_metodo_pago = models.ForeignKey(
        'metodos_pago.MetodoPago',
        on_delete=models.SET_NULL,
        db_column='id_metodo_pago',
        null=True,
        blank=True
    )
    
    id_platillo = models.IntegerField(null=True, blank=True)
    nombre_platillo = models.CharField(max_length=255, null=True, blank=True)
    observaciones = models.CharField(max_length=255, null=True, blank=True)
    precio_unitario = models.FloatField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=38, decimal_places=2, null=True, blank=True)
    total = models.DecimalField(max_digits=38, decimal_places=2, null=True, blank=True)
    
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        db_column='id_cliente',
        null=True,
        blank=True
    )
    
    id_usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_column='id_usuario',
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'pedidos_pedido'
        ordering = ['-fecha']

    def __str__(self):
        return f"Pedido #{self.id_pedido}"


class PedidoItem(models.Model):
    """Modelo para los items individuales de cada pedido"""
    id_item = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    platillo = models.ForeignKey(Platillo, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_platillo = models.CharField(max_length=255)
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pedidos_item'
        verbose_name = 'Item del Pedido'
        verbose_name_plural = 'Items del Pedido'
    
    def __str__(self):
        return f"{self.cantidad}x {self.nombre_platillo} - Pedido #{self.pedido.id_pedido}"
    
    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)