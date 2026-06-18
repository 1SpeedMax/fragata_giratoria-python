from django.test import TestCase
from usuarios.models import Rol


class AdminTest(TestCase):

    def test_crear_rol_admin(self):

        rol, created = Rol.objects.get_or_create(
        nombre_rol="ADMIN"
        )

        self.assertEqual(
            rol.nombre_rol,
            "ADMIN"
        )