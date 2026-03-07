from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from mi_app.views import inicio, dashboard, cerrar_sesion, contacto_view
from usuarios.views import registro_view
from fragata import views 

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin de Django (solo para superusuarios)
    
    # Dashboard PERSONALIZADO (tu diseño)
    path('dashboard/', dashboard, name='dashboard'),
    
    # Apps con CRUD
    path('productos/', include('productos.urls')),
    path('usuarios/', include('usuarios.urls')),
    path('compras/', include('compras.urls')),
    path('pedidos/', include('pedidos.urls')),
    path('metodospago/', include('metodos_pago.urls')),
    path('contacto/', include('contacto.urls')),
    
    # Autenticación
    path('registro/', registro_view, name='registro'),
    path('login/', auth_views.LoginView.as_view(template_name='home/login.html'), name='login'),
    path('logout/', cerrar_sesion, name='logout'),
    
    # Ajustes y Ayuda
    path('ajustes/', views.ajustes, name='ajustes'),
    path('ayuda/', views.ayuda, name='ayuda'),
    
    # Páginas públicas
    path('', inicio, name='inicio'),
    path('inicio/', inicio, name='inicio'),
]