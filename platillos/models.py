from django.db import models
from django.utils import timezone

class CategoriaPlatillo(models.Model):
    """Modelo para categorías de platillos"""
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    descripcion = models.TextField(verbose_name="Descripción", blank=True)
    emoji = models.CharField(max_length=10, verbose_name="Emoji", blank=True, help_text="Ej: 🍕, 🍔, 🥗, 🍣")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    orden = models.IntegerField(default=0, verbose_name="Orden")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Categoría de Platillo"
        verbose_name_plural = "Categorías de Platillos"
        ordering = ['orden', 'nombre']
    
    def __str__(self):
        return f"{self.emoji} {self.nombre}" if self.emoji else self.nombre


class Platillo(models.Model):
    """Modelo para platillos del menú"""
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    descripcion = models.TextField(verbose_name="Descripción")
    categoria = models.ForeignKey(CategoriaPlatillo, on_delete=models.CASCADE, related_name='platillos', verbose_name="Categoría")
    imagen_url = models.URLField(max_length=500, verbose_name="URL de Imagen", blank=True, help_text="URL de la imagen del platillo")
    emojis = models.CharField(max_length=50, verbose_name="Emojis", blank=True, help_text="Ej: 🐠🍋‍🟩")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    disponible = models.BooleanField(default=True, verbose_name="Disponible")
    destacado = models.BooleanField(default=False, verbose_name="Destacado")
    orden = models.IntegerField(default=0, verbose_name="Orden")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Platillo"
        verbose_name_plural = "Platillos"
        ordering = ['orden', '-fecha_creacion']
    
    def __str__(self):
        return f"{self.emojis} {self.nombre}" if self.emojis else self.nombre