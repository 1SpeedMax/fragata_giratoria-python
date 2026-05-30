import sys

from django.apps import AppConfig
from django.db.models.signals import post_migrate


class PlatillosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'platillos'
    verbose_name = 'Platillos'

    def ready(self):
        post_migrate.connect(self._cargar_datos_iniciales, sender=self)

    def _cargar_datos_iniciales(self, sender, **kwargs):
        if sender.name != 'platillos':
            return
        if self._es_comando_manage():
            return

        from platillos.models import Platillo

        if Platillo.objects.exists():
            return

        try:
            from platillos.carga_inicial import cargar_todo
            cargar_todo()
        except Exception:
            pass

    def _es_comando_manage(self):
        return 'makemigrations' in sys.argv
