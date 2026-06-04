import logging
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
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

            # ENVIAR CON SEND_MAIL DE DJANGO (NO RESEND)
            send_mail(
                subject=f"Contacto: {asunto or 'Sin asunto'}",
                message=contenido,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["arlcornd@gmail.com"],  # Directo al destinatario
                fail_silently=False,
            )

            messages.success(request, "✅ Mensaje enviado correctamente")
            
        except Exception as e:
            logger.error(f"Error en contacto: {str(e)}")
            messages.error(request, "❌ No se pudo enviar el mensaje")
        
        return redirect("contacto")

    return render(request, "home/contacto.html")