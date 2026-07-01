from django.contrib import messages
from django.contrib.messages.storage.fallback import FallbackStorage
from django.test import RequestFactory, TestCase

from usuarios.views import logout_view


class LogoutMessagesTest(TestCase):
    def test_logout_clears_previous_messages_and_shows_only_logout_confirmation(self):
        factory = RequestFactory()
        request = factory.get('/logout/')
        request.session = self.client.session
        setattr(request, '_messages', FallbackStorage(request))

        messages.success(request, 'Mensaje anterior que no debería persistir')

        response = logout_view(request)

        self.assertEqual(response.status_code, 302)
        stored_messages = list(messages.get_messages(request))
        self.assertEqual(len(stored_messages), 1)
        self.assertEqual(str(stored_messages[0]), '✅ Sesión cerrada correctamente')
