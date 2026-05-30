from platillos.datos_iniciales import CATEGORIAS, PLATILLOS
from platillos.models import CategoriaPlatillo, Platillo


def cargar_categorias():
    creadas = 0
    for cat in CATEGORIAS:
        _, created = CategoriaPlatillo.objects.get_or_create(
            nombre=cat['nombre'],
            defaults={
                'emoji': cat['emoji'],
                'activo': cat['activo'],
                'orden': cat['orden'],
            },
        )
        if created:
            creadas += 1
    return creadas


def cargar_platillos(actualizar_imagenes=False):
    categorias = {c.nombre: c for c in CategoriaPlatillo.objects.all()}
    insertados = 0
    actualizados = 0

    for datos in PLATILLOS:
        categoria = categorias.get(datos['categoria'])
        if not categoria:
            continue

        platillo, created = Platillo.objects.get_or_create(
            nombre=datos['nombre'],
            defaults={
                'descripcion': datos['descripcion'],
                'categoria': categoria,
                'precio': datos['precio'],
                'imagen_url': datos['imagen'],
                'emojis': datos['emojis'],
                'disponible': datos['disponible'],
                'destacado': datos['destacado'],
                'orden': datos['orden'],
            },
        )

        if created:
            insertados += 1
        elif actualizar_imagenes:
            cambio = False
            if platillo.imagen_url != datos['imagen']:
                platillo.imagen_url = datos['imagen']
                cambio = True
            if not platillo.emojis and datos['emojis']:
                platillo.emojis = datos['emojis']
                cambio = True
            if cambio:
                platillo.save(update_fields=['imagen_url', 'emojis'])
                actualizados += 1

    return insertados, actualizados


def cargar_todo(actualizar_imagenes=False):
    cargar_categorias()
    return cargar_platillos(actualizar_imagenes=actualizar_imagenes)
