from django.db import models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import check_password as django_check_password
from django.contrib.auth.hashers import make_password

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255, null=True, blank=True)

    class Estado(models.TextChoices):
        ACTIVO = "ACTIVO", "Activo"
        SUSPENDIDO = "SUSPENDIDO", "Suspendido"
        INACTIVO = "INACTIVO", "Inactivo"

    estado = models.CharField(
        max_length=12,
        choices=Estado.choices,
        default=Estado.ACTIVO,
        db_index=True,
    )

    created = models.DateTimeField(auto_now_add=True, null=True, editable=False)
    updated = models.DateTimeField(auto_now=True, null=True)

    def estado_badge_class(self):
        return {
            self.Estado.ACTIVO: "badge-activo",
            self.Estado.SUSPENDIDO: "badge-suspendido",
            self.Estado.INACTIVO: "badge-inactivo",
        }.get(self.estado, "badge-default")

    def __str__(self):
        return self.nombre_rol


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        nombre_usuario = extra_fields.pop('nombre_usuario', None)
        if not nombre_usuario:
            nombre_usuario = email.split('@')[0]
        user = self.model(email=email, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('estado', 'ACTIVO')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if 'nombre_usuario' not in extra_fields:
            extra_fields['nombre_usuario'] = email.split('@')[0]
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
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

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_usuario']

    objects = UsuarioManager()

    class Meta:
        db_table = 'usuarios_usuario'
        ordering = ['nombre_usuario']

    def __str__(self):
        return f"{self.nombre_usuario} ({self.email})"

    def set_password(self, raw_password):
        hashed = make_password(raw_password)
        self.password_hash = hashed
        super().set_password(raw_password)

    def check_password(self, raw_password):
        if self.password_hash and not getattr(self, '_password', None):
            self._password = self.password_hash
        return django_check_password(raw_password, self.password_hash)

    @property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, value):
        self.password_hash = value

    def filtro_rol(self):
        if not self.rol:
            return ''
        mapa = {
            'ADMIN': 'administrador',
            'COCINERO': 'cocinero',
            'MESERO': 'mesero',
            'CLIENTE': 'cliente',
        }
        return mapa.get(self.rol.nombre_rol.upper(), '')


class RegistroActividad(models.Model):
    ICONOS = {
        'crear': 'fa-plus-circle',
        'editar': 'fa-edit',
        'eliminar': 'fa-trash',
        'usuario': 'fa-user-plus',
        'pedido': 'fa-truck',
        'reporte': 'fa-chart-line',
    }

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    tipo = models.CharField(max_length=20, choices=[(k, k) for k in ICONOS.keys()])
    descripcion = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def icono(self):
        return self.ICONOS.get(self.tipo, 'fa-circle')

    def tiempo_relativo(self):
        from django.utils.timesince import timesince
        return timesince(self.fecha)

    def __str__(self):
        return f"{self.tipo}: {self.descripcion}"