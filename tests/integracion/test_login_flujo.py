from django.test import TestCase
from usuarios.models import Usuario


class LoginFlujoTest(TestCase):

    def setUp(self):

        self.usuario, _ = Usuario.objects.get_or_create(
            email="prueba_login@test.com",
            defaults={
                "nombre_usuario": "usuario_prueba_login"
            }
        )

        self.usuario.set_password("123456")
        self.usuario.save()

    def test_login_correcto(self):

        resultado = self.client.login(
            email="prueba_login@test.com",
            password="123456"
        )

        self.assertTrue(resultado)