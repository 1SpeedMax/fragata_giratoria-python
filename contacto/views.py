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
        asunto = request.POST.get('asunto', 'Mensaje desde contacto').strip()
        mensaje = request.POST.get('mensaje', '').strip()

        if not nombre or not email or not mensaje:
            messages.error(request, "❌ Todos los campos son obligatorios")
            return redirect('contacto')

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

            # 🔥 TU CORREO FIJO (DESTINO)
            recipient = "nm891678@gmail.com"

            correo = EmailMultiAlternatives(
                subject=f'📩 Nuevo mensaje de contacto: {asunto}',
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[email],
            )

            correo.attach_alternative(html_content, 'text/html')
            correo.send()

            messages.success(request, "✅ Mensaje enviado correctamente")
            return redirect('contacto')

        except Exception:
            logger.exception("Error al enviar contacto")
            messages.error(request, "❌ No se pudo enviar el mensaje")

    return render(request, 'home/contacto.html')

# Vista para la página de registro (si es parte de la misma app)
def registro_view(request):
    return render(request, 'home/contactanos.html')