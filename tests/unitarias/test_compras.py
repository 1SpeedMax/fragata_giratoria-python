from django.test import TestCase
from compras.models import Compra


class CompraTest(TestCase):

    def test_crear_compra(self):

        compra = Compra.objects.create(
            empresa="Proveedor Test"
        )

        self.assertEqual(
            compra.empresa,
            "Proveedor Test"
        )

    def test_total_por_defecto(self):

        compra = Compra.objects.create(
            empresa="Proveedor Test"
        )

        self.assertEqual(
            float(compra.total),
            0.0
        )