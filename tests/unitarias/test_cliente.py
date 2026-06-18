from django.test import TestCase
from pedidos.models import Cliente


class ClienteTest(TestCase):

    def test_registro_cliente(self):

        cliente = Cliente.objects.create(
            nombre="Cliente Test",
            email="cliente@test.com"
        )

        self.assertEqual(
            cliente.email,
            "cliente@test.com"
        )