from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.conf import settings 
from django.conf.urls.static import static 
from mi_app.views import (
    inicio, dashboard, cerrar_sesion, contacto_view, exportar_reporte_pdf,
    login_personalizado, cocina_dashboard, mesero_dashboard, cliente_dashboard,
    home_menu, cliente_menu, cliente_carrito, cliente_carrito_agregar, cliente_registrar_pedido,
    cocinero_actualizar_estado, mesero_entregar_pedido, cocina_check_pedidos,
    mesero_check_pedidos,
)
from usuarios.views import registro_view, solicitar_recuperacion_contraseña, restablecer_contraseña

# ===== VISTAS PARA AJUSTES Y AYUDA =====
def ajustes_view(request):
    return render(request, 'roles/admin/ajustes.html')

def ayuda_view(request):
    return render(request, 'roles/admin/ayuda.html')
# ========================================

urlpatterns = [
    path('admin/', admin.site.urls),

    # Dashboard
    path('dashboard/', dashboard, name='dashboard'),
    path('cocina/dashboard/', cocina_dashboard, name='cocina_dashboard'),
    path('mesero/dashboard/', mesero_dashboard, name='mesero_dashboard'),
    path('cliente/dashboard/', cliente_dashboard, name='cliente_dashboard'),

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
    path('login/', login_personalizado, name='login'),
    path('logout/', cerrar_sesion, name='logout'),
    path('password-reset/', solicitar_recuperacion_contraseña, name='password_reset'),
    path('restablecer-contraseña/<uidb64>/<token>/', restablecer_contraseña, name='restablecer_contraseña'),

    # Inicio
    path('inicio/', inicio, name='inicio'),
    path('', inicio, name='home'),
    
    # Menú
    path('home/menu/', home_menu, name='home_menu'),
    path('cliente/menu/', cliente_menu, name='cliente_menu'),
    path('cliente/carrito/', cliente_carrito, name='cliente_carrito'),
    path('cliente/carrito/agregar/', cliente_carrito_agregar, name='cliente_carrito_agregar'),
    path('cliente/pedido/registrar/', cliente_registrar_pedido, name='cliente_registrar_pedido'),
    
    # Flujo Cocina y Mesero
    path('cocina/actualizar/<int:pedido_id>/', cocinero_actualizar_estado, name='cocinero_actualizar_estado'),
    path('mesero/entregar/<int:pedido_id>/', mesero_entregar_pedido, name='mesero_entregar_pedido'),
    path('cocina/check_pedidos/', cocina_check_pedidos, name='cocina_check_pedidos'),
    path('mesero/check_pedidos/', mesero_check_pedidos, name='mesero_check_pedidos'),
    
    # Reportes
    path('dashboard/exportar-pdf/', exportar_reporte_pdf, name='exportar_reporte_pdf'),
    
    # Admin - Ajustes y Ayuda
    path('ajustes/', ajustes_view, name='ajustes'),
    path('ayuda/', ayuda_view, name='ayuda'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)