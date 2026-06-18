from django.test import TestCase
from productos.models import Producto, UnidadMedida


class PedidoInventarioTest(TestCase):

    def setUp(self):

        self.unidad = UnidadMedida.objects.create(
            nombre="Kilogramo",
            abreviatura="kg"
        )

    def test_stock_producto(self):

        producto = Producto.objects.create(
            nombre="Camaron",
            precio_unitario=25000,
            stock_actual=50,
            stock_minimo=5,
            unidad_medida=self.unidad
        )

        producto.stock_actual -= 10
        producto.save()

        self.assertEqual(
            producto.stock_actual,
            40
        )