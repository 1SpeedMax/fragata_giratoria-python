import logging
import resend
from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib import messages

logger = logging.getLogger(__name__)

# Inicializar Resend
resend.api_key = settings.RESEND_API_KEY

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
            contenido_html = f"""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>📩 Nuevo mensaje de contacto</h2>
                <p><strong>👤 Nombre:</strong> {nombre}</p>
                <p><strong>📧 Email:</strong> {email}</p>
                <p><strong>📌 Asunto:</strong> {asunto or 'Sin asunto'}</p>
                <br>
                <p><strong>📝 Mensaje:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                    {mensaje.replace(chr(10), '<br>')}
                </div>
                <hr>
                <p style="color: #888; font-size: 12px;">Responder a: {email}</p>
            </body>
            </html>
            """

            # ✅ ENVÍO FUNCIONAL - Usando dominio de prueba de Resend
            response = resend.Emails.send({
                "from": "onboarding@resend.dev",  # Dominio gratuito de Resend
                "to": ["arlcornd@gmail.com"],     # Llega a arlcornd
                "subject": f"Contacto: {asunto or 'Sin asunto'}",
                "html": contenido_html,
                "reply_to": email,  # Las respuestas van al usuario
            })

            logger.info(f"Mensaje enviado. ID: {response.get('id')}")
            messages.success(request, "✅ Mensaje enviado correctamente")
            
        except Exception as e:
            logger.exception(f"Error: {e}")
            messages.error(request, "❌ No se pudo enviar el mensaje")
        
        return redirect("contacto")

    return render(request, "home/contacto.html")