
from django.db import models

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