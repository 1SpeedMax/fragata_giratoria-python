from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import OperationalError

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
        self.stdout.write('Ejecutando migraciones antes de cargar datos...')
        call_command('migrate', interactive=False)

        from platillos.models import CategoriaPlatillo, Platillo

        try:
            cats_antes = CategoriaPlatillo.objects.count()
            platos_antes = Platillo.objects.count()
        except OperationalError as exc:
            self.stdout.write(self.style.ERROR(
                'No se encontró la tabla platillos_categoriaplatillo. Asegúrate de que las migraciones se hayan aplicado correctamente.'
            ))
            self.stdout.write(self.style.ERROR(str(exc)))
            return

        insertados, actualizados = cargar_todo(
            actualizar_imagenes=options['actualizar_imagenes']
        )

        cats = CategoriaPlatillo.objects.count()
        total = Platillo.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'Categorías: {cats_antes} -> {cats} | '
            f'Platillos: {platos_antes} -> {total} (nuevos: {insertados}, img actualizadas: {actualizados})'
        ))
        if cats == 0 or total == 0:
            self.stdout.write(self.style.ERROR(
                'AVISO: la BD sigue vacía. Verifica DATABASE_URL en Railway.'
            ))

    def _total_platillos(self):
        from platillos.models import Platillo
        return Platillo.objects.count()
