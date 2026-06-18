from django.test import TestCase
from pedidos.models import Cliente, Pedido


class PedidoTest(TestCase):

    def test_crear_cliente(self):

        cliente = Cliente.objects.create(
            nombre="Nicolas",
            email="nico@test.com",
            telefono="3001234567"
        )

        self.assertEqual(
            cliente.nombre,
            "Nicolas"
        )

    def test_crear_pedido(self):

        cliente = Cliente.objects.create(
            nombre="Nicolas"
        )

        pedido = Pedido.objects.create(
            id_cliente=cliente,
            estado="PENDIENTE"
        )

        self.assertEqual(
            pedido.estado,
            "PENDIENTE"
        )