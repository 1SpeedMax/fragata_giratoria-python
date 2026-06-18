from django.test import TestCase
from usuarios.models import Rol, Usuario


class UsuarioModelTest(TestCase):

    def setUp(self):
        self.rol, _ = Rol.objects.get_or_create(
            nombre_rol="ADMIN"
        )

    def test_crear_rol(self):
        self.assertEqual(
            self.rol.nombre_rol,
            "ADMIN"
        )

    def test_crear_usuario(self):
        usuario = Usuario.objects.create_user(
            email="admin1@test.com",
            password="123456",
            nombre_usuario="admin1",
            rol=self.rol
        )

        self.assertEqual(
            usuario.email,
            "admin1@test.com"
        )

    def test_password_correcta(self):
        usuario = Usuario.objects.create_user(
            email="admin2@test.com",
            password="123456",
            nombre_usuario="admin2"
        )

        self.assertTrue(
            usuario.check_password("123456")
        )

    def test_estado_por_defecto(self):
        usuario = Usuario.objects.create_user(
            email="admin3@test.com",
            password="123456",
            nombre_usuario="admin3"
        )

        self.assertEqual(
            usuario.estado,
            "ACTIVO"
        )