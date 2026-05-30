from django.core.management.base import BaseCommand

from productos.datos_unidades import UNIDADES_MEDIDA
from productos.models import UnidadMedida


class Command(BaseCommand):
    help = "Carga unidades de medida por defecto para productos"

    def handle(self, *args, **options):
        creadas = 0
        actualizadas = 0

        for datos in UNIDADES_MEDIDA:
            unidad, created = UnidadMedida.objects.get_or_create(
                nombre=datos["nombre"],
                defaults={"abreviatura": datos["abreviatura"]},
            )
            if created:
                creadas += 1
            elif unidad.abreviatura != datos["abreviatura"]:
                unidad.abreviatura = datos["abreviatura"]
                unidad.save(update_fields=["abreviatura"])
                actualizadas += 1

        total = UnidadMedida.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f"Unidades: {total} en BD (nuevas: {creadas}, abrev. actualizadas: {actualizadas})"
        ))
