from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect
from mi_app.views import inicio, dashboard, cerrar_sesion, contacto_view, exportar_reporte_pdf
from usuarios.views import registro_view
from usuarios import views as usuarios_views
from fragata import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Dashboard
    path('dashboard/', dashboard, name='dashboard'),
    path('dashboard/exportar-pdf/', exportar_reporte_pdf, name='exportar_reporte_pdf'),
    
    # Apps
    path('productos/', include('productos.urls')),
    path('usuarios/', include('usuarios.urls')),
    path('compras/', include('compras.urls')),
    path('pedidos/', include('pedidos.urls')),
    path('platillos/', include('platillos.urls')),
    path('reportes/', include('reportes.urls')),
    path('metodospago/', include('metodos_pago.urls')),
    path('contacto/', include('contacto.urls')),
    
    # Autenticación
    path('registro/', registro_view, name='registro'),
    path('login/', auth_views.LoginView.as_view(template_name='home/login.html'), name='login'),
    path('logout/', cerrar_sesion, name='logout'),
    
    # Configuración
    path('ajustes/', views.ajustes, name='ajustes'),
    path('ayuda/', views.ayuda, name='ayuda'),

    # REGISTRO GLOBAL (sin /usuarios/)
    path('registro/', usuarios_views.registro_view, name='registro'),
    
    # Inicio
    path('inicio/', inicio, name='inicio'),
    path('', inicio, name='inicio'),
]