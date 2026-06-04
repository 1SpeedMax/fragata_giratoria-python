import logging
import threading

from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import EmailMessage
from django.conf import settings

logger = logging.getLogger(__name__)


def contacto_view(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre", "").strip()
        email = request.POST.get("email", "").strip()
        asunto = request.POST.get("asunto", "").strip()
        mensaje = request.POST.get("mensaje", "").strip()

        if not nombre or not email or not mensaje:
            messages.error(request, "❌ Todos los campos son obligatorios")
            return redirect("contacto")

        try:
            contenido = f"""
📩 NUEVO MENSAJE DE CONTACTO

👤 Nombre: {nombre}
📧 Email: {email}
📌 Asunto: {asunto or 'Sin asunto'}

📝 Mensaje:
{mensaje}
"""

            # ✅ Usa EMAIL_CONTACT como destinatario
            correo = EmailMessage(
                subject=f"Contacto: {asunto or 'Sin asunto'}",
                body=contenido,
                from_email=settings.DEFAULT_FROM_EMAIL,  # Quién envía (EMAIL_HOST_USER)
                to=[settings.EMAIL_CONTACT],  # Quién recibe (arlcornd@gmail.com)
                reply_to=[email],  # Responder al usuario que llenó el formulario
            )

            # ENVÍO ASÍNCRONO
            threading.Thread(
                target=correo.send,
                kwargs={"fail_silently": False}
            ).start()

            messages.success(request, "✅ Mensaje enviado correctamente")
            return redirect("contacto")

        except Exception as e:
            logger.exception(f"Error en contacto: {e}")
            messages.error(request, "❌ No se pudo enviar el mensaje")
            return redirect("contacto")

    return render(request, "home/contacto.html")