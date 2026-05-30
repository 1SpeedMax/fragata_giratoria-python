from django.core.management.base import BaseCommand

from platillos.carga_inicial import cargar_todo


class Command(BaseCommand):
    help = 'Carga categorías y los 18 platillos del menú con sus imágenes en static/img/menu/'

    def add_arguments(self, parser):
        parser.add_argument(
            '--actualizar-imagenes',
            action='store_true',
            help='Actualiza rutas de imagen en platillos ya existentes',
        )

    def handle(self, *args, **options):
        insertados, actualizados = cargar_todo(
            actualizar_imagenes=options['actualizar_imagenes']
        )
        total = self._total_platillos()
        self.stdout.write(self.style.SUCCESS(
            f'Platillos nuevos: {insertados} | Imágenes actualizadas: {actualizados} | Total en BD: {total}'
        ))

    def _total_platillos(self):
        from platillos.models import Platillo
        return Platillo.objects.count()
