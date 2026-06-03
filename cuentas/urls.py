from django.urls import path
from django.contrib.auth import views as auth_views
from .views import registro_view

urlpatterns = [
    # Registro de usuarios
    path('registro/', registro_view, name='registro'),

    # Login / Logout
    path('login/', auth_views.LoginView.as_view(template_name='home/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    # Recuperación de contraseña (usando vistas nativas de Django)
    path('recuperar-password/', 
         auth_views.PasswordResetView.as_view(
             template_name='home/recuperar_contraseña.html',
             email_template_name='registration/password_reset_email.html',
             subject_template_name='registration/password_reset_subject.txt',
             success_url='/cuentas/recuperar-password/enviado/',
         ), 
         name='password_reset'),
    
    path('recuperar-password/enviado/', 
         auth_views.PasswordResetDoneView.as_view(
             template_name='home/recuperar_enviado.html',
         ), 
         name='password_reset_done'),
    
    path('reset/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(
             template_name='home/restablecer_contraseña.html',
             success_url='/cuentas/reset/completado/',
         ), 
         name='password_reset_confirm'),
    
    path('reset/completado/', 
         auth_views.PasswordResetCompleteView.as_view(
             template_name='home/reset_completado.html',
         ), 
         name='password_reset_complete'),
]
