from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

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
