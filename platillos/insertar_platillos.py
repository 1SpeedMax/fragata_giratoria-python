"""Script legado: usa el comando manage.py cargar_platillos."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fragata.settings')
django.setup()

from platillos.carga_inicial import cargar_todo

if __name__ == '__main__':
    insertados, actualizados = cargar_todo(actualizar_imagenes=True)
    print(f'Nuevos: {insertados} | Actualizados: {actualizados}')
