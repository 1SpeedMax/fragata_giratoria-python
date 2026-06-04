from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site

Usuario = get_user_model()


class RegistroForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password1', 'password2']


class PasswordResetRequestForm(forms.Form):
    email = forms.EmailField(
        label="Correo electrónico",
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'tu@correo.com'
        })
    )
    
    def send_reset_email(self, request):
        """
        Envía el correo de recuperación de contraseña
        """
        email = self.cleaned_data['email']
        
        # Buscar si existe el usuario
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            # No revelamos si el email existe o no por seguridad
            return True  # Siempre retornamos True por seguridad
        
        # Generar token y uid
        token = default_token_generator.make_token(usuario)
        uid = urlsafe_base64_encode(force_bytes(usuario.pk))
        
        # Construir el enlace de recuperación
        domain = get_current_site(request).domain
        protocol = 'https' if request.is_secure() else 'http'
        reset_url = reverse('password_reset_confirm', kwargs={
            'uidb64': uid,
            'token': token
        })
        full_url = f"{protocol}://{domain}{reset_url}"
        
        # Personalizar el contenido del correo
        asunto = f"Recuperación de contraseña - La Fragata Giratoria"
        
        mensaje = f"""
        Hola {usuario.get_full_name() or usuario.username or usuario.email},
        
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en La Fragata Giratoria.
        
        Para crear una nueva contraseña, haz clic en el siguiente enlace:
        {full_url}
        
        Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá sin cambios.
        
        Este enlace es válido por 24 horas.
        
        ---
        La Fragata Giratoria
        """
        
        try:
            # Enviar correo usando la configuración del sistema (desde nm891678@gmail.com)
            # NO desde el email del usuario, porque eso causaría problemas de spam
            send_mail(
                subject=asunto,
                message=mensaje,
                from_email=settings.DEFAULT_FROM_EMAIL,  # Usa tu cuenta nm891678@gmail.com
                recipient_list=[email],  # Se envía al email del usuario (arlcond@gmail.com)
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error al enviar email: {e}")
            return False


class NewPasswordForm(forms.Form):
    password = forms.CharField(
        label="Nueva contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        min_length=8
    )
    confirm_password = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        min_length=8
    )
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm = cleaned_data.get('confirm_password')
        if password and confirm and password != confirm:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return cleaned_data