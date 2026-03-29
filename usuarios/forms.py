from django import forms
from .models import Usuario
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class RegistroForm(forms.Form):
    nombreUsuario = forms.CharField(
        label="Nombre",
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': 'Ingresa tu nombre'
        })
    )

    email = forms.EmailField(
        label="Correo electrónico",
        widget=forms.EmailInput(attrs={
            'class': 'input',
            'placeholder': 'Ingresa tu correo electrónico'
        })
    )

    password = forms.CharField(
        label="Contraseña",
        widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': 'Ingresa tu contraseña'               
        })
    )

    confirmPassword = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput(attrs={
            'class': 'input', 
            'placeholder': 'Ingresa tu contraseña nuevamente'               
        })
    )

    # 🔴 VALIDAR EMAIL
    def clean_email(self):
        email = self.cleaned_data.get("email")
        if Usuario.objects.filter(email=email).exists():
            raise forms.ValidationError("Este correo ya está registrado")
        return email

    # 🔴 VALIDAR CONTRASEÑA (seguridad Django)
    def clean_password(self):
        password = self.cleaned_data.get("password")

        try:
            validate_password(password)
        except ValidationError as e:
            raise forms.ValidationError(e.messages[0])  # 👈 solo 1 error

        return password

    # 🔴 VALIDAR CONFIRMACIÓN
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm = cleaned_data.get("confirmPassword")

        if password and confirm and password != confirm:
            self.add_error('confirmPassword', "Las contraseñas no coinciden")

        return cleaned_data