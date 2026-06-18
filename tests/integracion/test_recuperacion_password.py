from django.test import TestCase
from django.core import mail


class RecuperacionPasswordTest(TestCase):

    def test_envio_correo(self):

        mail.send_mail(
            "Recuperar contraseña",
            "Prueba",
            "test@test.com",
            ["destino@test.com"]
        )

        self.assertEqual(
            len(mail.outbox),
            1
        )