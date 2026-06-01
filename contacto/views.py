import logging

from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

logger = logging.getLogger(__name__)


def contacto_view(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        email = request.POST.get('email', '').strip()
        asunto = request.POST.get('asunto', 'Mensaje desde el formulario de contacto').strip()
        mensaje = request.POST.get('mensaje', '').strip()

        try:
            html_content = render_to_string(
                'home/contactanos_email.html',
                {
                    'nombre': nombre,
                    'email': email,
                    'asunto': asunto,
                    'mensaje': mensaje,
                },
            )
            plain_message = strip_tags(html_content)

            recipient = getattr(settings, 'CONTACT_EMAIL_RECIPIENT', settings.EMAIL_HOST_USER)
            if not recipient:
                recipient = settings.EMAIL_HOST_USER

            correo = EmailMultiAlternatives(
                subject=f'Nuevo mensaje de contacto: {asunto}',
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[email] if email else [],
            )
            correo.attach_alternative(html_content, 'text/html')
            correo.send(fail_silently=False)
            messages.success(request, '✅ Tu mensaje se envió correctamente. Revisa tu bandeja de entrada.')
            return redirect('contacto')
        except Exception:
            logger.exception('Error al enviar correo de contacto')
            messages.error(
                request,
                'No se pudo enviar el mensaje. Verifica la configuración de correo e intenta nuevamente.',
            )

    return render(request, 'home/contacto.html')

# Vista para la página de registro (si es parte de la misma app)
def registro_view(request):
    return render(request, 'home/contactanos.html')