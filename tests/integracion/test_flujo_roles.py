from django.test import TestCase
from usuarios.models import Rol


class FlujoRolesTest(TestCase):

    def test_roles_existen(self):

        admin, _ = Rol.objects.get_or_create(
            nombre_rol="ADMIN"
        )

        mesero, _ = Rol.objects.get_or_create(
            nombre_rol="MESERO"
        )

        cocinero, _ = Rol.objects.get_or_create(
            nombre_rol="COCINERO"
        )

        self.assertTrue(admin)
        self.assertTrue(mesero)
        self.assertTrue(cocinero)