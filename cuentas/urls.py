# contacto/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from .views import registro_view

urlpatterns = [
    # Registro de usuarios
    path('registro/', registro_view, name='registro'),

    # Login / Logout usando templates en home/
    path('login/', auth_views.LoginView.as_view(template_name='home/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]