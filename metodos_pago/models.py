from django.db import models

class MetodoPago(models.Model):
    id_metodo_pago = models.AutoField(primary_key=True, db_column='id_metodo_pago')
    nombre_metodo = models.CharField(max_length=50, db_column='nombre_metodo')
    descripcion = models.CharField(max_length=255, null=True, blank=True, db_column='descripcion')

    class Meta:
        managed = False  # ¡Importante! Django no intentará crear/borrar la tabla
        db_table = 'metodos_pago'
        ordering = ['nombre_metodo']

    def __str__(self):
        return self.nombre_metodo