from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def contacto_view(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre")
        email = request.POST.get("email")
        asunto = request.POST.get("asunto")
        mensaje = request.POST.get("mensaje")

        html_content = render_to_string(
            "home/contactanos_email.html",
            {
                "nombre": nombre,
                "email": email,
                "asunto": asunto,
                "mensaje": mensaje,
            },
        )

        plain_message = strip_tags(html_content)

        send_mail(
            subject=f"Nuevo mensaje: {asunto}",
            message=plain_message,
            from_email=email,
            recipient_list=["tucorreo@gmail.com"],
            html_message=html_content,
        )