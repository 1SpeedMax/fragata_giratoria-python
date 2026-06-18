from django.test import TestCase
from compras.models import Compra


class CompraCompletaTest(TestCase):

    def test_crear_compra(self):

        compra = Compra.objects.create(
            empresa="Proveedor Test"
        )

        self.assertIsNotNone(
            compra.id
        )