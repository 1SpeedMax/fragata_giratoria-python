from django.test import TestCase
from productos.models import Producto, UnidadMedida


class ProductoTest(TestCase):

    def setUp(self):

        self.unidad = UnidadMedida.objects.create(
            nombre="Kilogramo",
            abreviatura="kg"
        )

    def test_crear_producto(self):

        producto = Producto.objects.create(
            nombre="Camaron",
            precio_unitario=25000,
            stock_actual=50,
            stock_minimo=10,
            unidad_medida=self.unidad
        )

        self.assertEqual(
            producto.nombre,
            "Camaron"
        )

    def test_stock_valido(self):

        producto = Producto.objects.create(
            nombre="Pescado",
            precio_unitario=10000,
            stock_actual=20,
            stock_minimo=5,
            unidad_medida=self.unidad
        )

        self.assertGreaterEqual(
            producto.stock_actual,
            producto.stock_minimo
        )