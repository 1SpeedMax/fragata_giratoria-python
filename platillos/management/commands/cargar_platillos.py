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
        from platillos.models import CategoriaPlatillo, Platillo

        cats_antes = CategoriaPlatillo.objects.count()
        platos_antes = Platillo.objects.count()

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
