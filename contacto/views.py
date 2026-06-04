from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import EmailMessage
import logging

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
            # 🔥 TU CORREO FIJO (DESTINO)
            destinatario = "nm891678@gmail.com"

            contenido = f"""
            📩 Nuevo mensaje desde el formulario de contacto

            👤 Nombre: {nombre}
            📧 Email: {email}
            📌 Asunto: {asunto}

            📝 Mensaje:
            {mensaje}
            """

            email_msg = EmailMessage(
                subject=f"Nuevo contacto: {asunto or 'Sin asunto'}",
                body=contenido,
                from_email=None,  # usa DEFAULT_FROM_EMAIL
                to=[destinatario],
                reply_to=[email],
            )

            email_msg.send()

            messages.success(request, "✅ Mensaje enviado correctamente")
            return redirect("contacto")

        except Exception as e:
            logger.exception("Error enviando contacto")
            messages.error(request, f"❌ Error al enviar: {e}")
            return redirect("contacto")

    return render(request, "home/contacto.html")