from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.utils import timezone

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'CREAR'),
        ('UPDATE', 'MODIFICAR'),
        ('DELETE', 'ELIMINAR'),
    ]
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    user = models.ForeignKey(get_user_model(), null=True, blank=True, on_delete=models.SET_NULL)
    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.SET_NULL)
    object_id = models.CharField(max_length=255, blank=True)
    object_repr = models.CharField(max_length=255)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    changes = models.JSONField(null=True, blank=True)
    ip = models.CharField(max_length=45, blank=True)
    url = models.CharField(max_length=512, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.get_action_display()} {self.content_type.model if self.content_type else 'unknown'}: {self.object_repr} @ {self.timestamp}"


class CategoriaPlatillo(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Platillo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(CategoriaPlatillo, on_delete=models.CASCADE)
    imagen_url = models.CharField(max_length=255)
    emojis = models.CharField(max_length=100, default="🍽️")

    def __str__(self):
        return self.nombre