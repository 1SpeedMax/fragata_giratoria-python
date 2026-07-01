import uuid

from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse

from productos.models import Producto, UnidadMedida


class CrudStateChangeTest(TestCase):
    def setUp(self):
        suffix = uuid.uuid4().hex[:8]
        self.user = get_user_model().objects.create_superuser(
            email=f'admin_{suffix}@test.com',
            nombre_usuario=f'admin_{suffix}',
            password='12345678'
        )
        self.client.force_login(self.user)

        self.unidad = UnidadMedida.objects.create(nombre='Unidad', abreviatura='ud')
        self.producto = Producto.objects.create(
            nombre='Producto prueba',
            precio_unitario=10,
            stock_actual=5,
            stock_minimo=1,
            unidad_medida=self.unidad,
            activo=True,
        )

    def test_producto_change_state_instead_of_delete(self):
        url = reverse('productos:eliminar', kwargs={'pk': self.producto.pk})

        response = self.client.post(url, {'estado': 'inactivo'})

        self.assertEqual(response.status_code, 302)
        self.producto.refresh_from_db()
        self.assertFalse(self.producto.activo)

        messages = list(get_messages(response.wsgi_request))
        self.assertTrue(any('estado' in str(message).lower() for message in messages))
