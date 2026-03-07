from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    nombre_rol = models.CharField(max_length=50)

    class Meta:
        db_table = 'rol'
        ordering = ['nombre_rol']
        managed = False  # No modificar esta tabla

    def __str__(self):
        return self.nombre_rol


class Usuario(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('SUSPENDIDO', 'Suspendido'),
    ]

    id_usuario = models.AutoField(primary_key=True)
    email = models.CharField(max_length=100, unique=True)
    estado = models.CharField(
        max_length=10, 
        choices=ESTADO_CHOICES, 
        null=True, 
        blank=True, 
        default='ACTIVO'
    )
    fecha_creacion = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    nombre_usuario = models.CharField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    rol = models.ForeignKey(
        Rol, 
        on_delete=models.PROTECT, 
        db_column='rol_id',
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'usuario'
        ordering = ['nombre_usuario']
        managed = False  # ¡CRÍTICO! No modificar esta tabla

    def __str__(self):
        return f"{self.nombre_usuario} ({self.email})"

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)