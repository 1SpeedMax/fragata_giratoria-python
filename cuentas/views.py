# cuentas/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .forms import RegistroForm, PasswordResetRequestForm, NewPasswordForm

Usuario = get_user_model()


# Vista de registro
def registro_view(request):
    if request.method == "POST":
        form = RegistroForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "¡Registro exitoso!")
            return redirect("/")
    else:
        form = RegistroForm()
    
    return render(request, "home/registro.html", {"form": form})


# Vista para solicitar recuperación de contraseña
def password_reset_request(request):
    if request.method == 'POST':
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            
            try:
                usuario = Usuario.objects.get(email=email)
                
                # Generar token y uid
                token = default_token_generator.make_token(usuario)
                uid = urlsafe_base64_encode(force_bytes(usuario.pk))
                
                # Construir enlace de recuperación
                protocol = 'https' if request.is_secure() else 'http'
                domain = request.get_host()
                reset_url = f"{protocol}://{domain}/reset/{uid}/{token}/"
                
                # Asunto y mensaje del correo
                asunto = "Recuperación de contraseña - La Fragata Giratoria"
                mensaje = f"""
Hola {usuario.get_full_name() or usuario.username},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en La Fragata Giratoria.

Para crear una nueva contraseña, haz clic en el siguiente enlace:
{reset_url}

Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá sin cambios.

Este enlace es válido por 24 horas.

---
La Fragata Giratoria
"""
                # Enviar correo
                send_mail(
                    subject=asunto,
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                
                messages.success(request, 
                    "Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.")
                
            except Usuario.DoesNotExist:
                # Por seguridad, no revelamos si el email existe o no
                messages.success(request, 
                    "Si el correo está registrado, recibirás las instrucciones para recuperar tu contraseña.")
            
            return redirect('login')
    else:
        form = PasswordResetRequestForm()
    
    return render(request, 'cuentas/password_reset_request.html', {'form': form})


# Vista para establecer nueva contraseña
def password_reset_confirm(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        usuario = Usuario.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
        usuario = None
    
    if usuario and default_token_generator.check_token(usuario, token):
        if request.method == 'POST':
            form = NewPasswordForm(request.POST)
            if form.is_valid():
                nueva_password = form.cleaned_data['password']
                usuario.set_password(nueva_password)
                usuario.save()
                messages.success(request, "Tu contraseña ha sido actualizada exitosamente.")
                return redirect('login')
        else:
            form = NewPasswordForm()
        
        return render(request, 'cuentas/password_reset_confirm.html', {
            'form': form,
            'validlink': True
        })
    else:
        return render(request, 'cuentas/password_reset_confirm.html', {
            'validlink': False
        })