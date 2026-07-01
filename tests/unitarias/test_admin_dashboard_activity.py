from django.test import TestCase
from django.urls import reverse

from usuarios.models import RegistroActividad, Usuario, Rol


class AdminDashboardActivityTest(TestCase):
    def setUp(self):
        self.rol_admin = Rol.objects.create(nombre_rol='ADMIN', descripcion='Administrador')
        self.user = Usuario.objects.create_user(
            email='admin@example.com',
            password='12345678',
            nombre_usuario='admin',
            rol=self.rol_admin,
        )

    def test_dashboard_recent_activity_uses_registered_activity_log(self):
        RegistroActividad.objects.create(
            usuario=self.user,
            tipo='pedido',
            descripcion='Pedido #99 enviado a cocina',
        )

        self.client.force_login(self.user)
        response = self.client.get(reverse('dashboard'))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.context['actividades_recientes'])
        self.assertTrue(
            any(
                actividad['descripcion'] == 'Pedido #99 enviado a cocina'
                for actividad in response.context['actividades_recientes']
            )
        )
