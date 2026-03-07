from django.db import models
from usuarios.models import Usuario

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
        db_table = 'cliente'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre or f"Cliente {self.id_cliente}"


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    cantidad = models.IntegerField(null=True, blank=True)
    estado = models.CharField(max_length=255, null=True, blank=True, default='PENDIENTE')
    estado_cocina = models.CharField(max_length=255, null=True, blank=True)
    estado_mesero = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    id_adicional = models.IntegerField(null=True, blank=True)
    
    # Relación con métodos de pago (comentada temporalmente hasta que exista)
    # id_metodo_pago = models.ForeignKey(
    #     'metodos_pago.MetodoPago',
    #     on_delete=models.SET_NULL,
    #     db_column='id_metodo_pago',
    #     null=True,
    #     blank=True
    # )
    
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
        Usuario,
        on_delete=models.SET_NULL,
        db_column='id_usuario',
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'pedido'
        ordering = ['-fecha']

    def __str__(self):
        return f"Pedido #{self.id_pedido} - {self.nombre_platillo or 'Sin nombre'}"