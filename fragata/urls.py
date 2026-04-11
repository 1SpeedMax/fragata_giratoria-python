from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from mi_app.views import inicio, dashboard, cerrar_sesion, contacto_view, exportar_reporte_pdf
from usuarios import views as usuarios_views  # ← IMPORTAR ASÍ
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
    path('registro/', usuarios_views.registro_view, name='registro'),  # ← CORREGIDO
    path('login/', usuarios_views.login_view, name='login'),  # ← CORREGIDO
    path('logout/', cerrar_sesion, name='logout'),
    
    # Dashboards por rol
    path('dashboard/admin/', usuarios_views.dashboard_admin, name='dashboard_admin'),
    path('dashboard/cocinero/', usuarios_views.dashboard_cocinero, name='dashboard_cocinero'),
    path('dashboard/mesero/', usuarios_views.dashboard_mesero, name='dashboard_mesero'),
    path('dashboard/cliente/', usuarios_views.dashboard_cliente, name='dashboard_cliente'),
    path('dashboard/redirect/', usuarios_views.dashboard_redirect, name='dashboard_redirect'),
    
    # Configuración
    path('ajustes/', views.ajustes, name='ajustes'),
    path('ayuda/', views.ayuda, name='ayuda'),
    
    # Inicio
    path('inicio/', inicio, name='inicio'),
    path('', inicio, name='inicio'),
    
    # Menú público
    path('', include('platillos.urls')),
]