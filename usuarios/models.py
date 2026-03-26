from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    nombre_rol = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'usuarios_rol'  # Cambiar nombre para evitar conflictos
        ordering = ['nombre_rol']
        # QUITAR managed = False

    def __str__(self):
        return self.nombre_rol


class UsuarioManager(BaseUserManager):
    def create_user(self, nombre_usuario, email, password=None, **extra_fields):
        if not nombre_usuario:
            raise ValueError('El nombre de usuario es obligatorio')
        if not email:
            raise ValueError('El email es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(
            nombre_usuario=nombre_usuario,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, nombre_usuario, email, password=None, **extra_fields):
        extra_fields.setdefault('estado', 'ACTIVO')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(nombre_usuario, email, password, **extra_fields)


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
    
    # Campos requeridos por Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'nombre_usuario'
    REQUIRED_FIELDS = ['email']

    objects = UsuarioManager()

    class Meta:
        db_table = 'usuarios_usuario'  # Cambiar nombre para evitar conflictos
        ordering = ['nombre_usuario']
        # QUITAR managed = False

    def __str__(self):
        return f"{self.nombre_usuario} ({self.email})"

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)
        self.password = self.password_hash  # Para compatibilidad con AbstractBaseUser

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)
    
    @property
    def password(self):
        return self.password_hash
    
    @password.setter
    def password(self, value):
        self.password_hash = value