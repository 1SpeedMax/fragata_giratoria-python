from django.apps import AppConfig


class ProductosConfig(AppConfig):
    name = 'productos'

    def ready(self):
        from .seed import cargar_productos
        cargar_productos()