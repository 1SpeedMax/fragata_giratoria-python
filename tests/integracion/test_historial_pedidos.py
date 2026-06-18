from django.test import TestCase
from pedidos.models import Cliente, Pedido


class HistorialPedidosTest(TestCase):

    def test_historial(self):

        cliente = Cliente.objects.create(
            nombre="Nicolas"
        )

        Pedido.objects.create(
            id_cliente=cliente,
            estado="PENDIENTE"
        )

        Pedido.objects.create(
            id_cliente=cliente,
            estado="ENTREGADO"
        )

        self.assertEqual(
            Pedido.objects.count(),
            2
        )