from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


def contacto_view(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        email = request.POST.get('email', '').strip()
        asunto = request.POST.get('asunto', 'Mensaje desde el formulario de contacto').strip()
        mensaje = request.POST.get('mensaje', '').strip()

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

        try:
            send_mail(
                subject=f'Nuevo mensaje de contacto: {asunto}',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL_RECIPIENT],
                html_message=html_content,
                headers={'Reply-To': email} if email else None,
                fail_silently=False,
            )
            messages.success(request, '✅ Tu mensaje se envió correctamente. Revisa tu bandeja de entrada.')
            return redirect('contacto')
        except Exception as e:
            messages.error(
                request,
                f'No se pudo enviar el mensaje. Verifica la configuración de correo. Detalle: {e}',
            )

    return render(request, 'home/contacto.html')

# Vista para la página de registro (si es parte de la misma app)
def registro_view(request):
    return render(request, 'home/contactanos.html')