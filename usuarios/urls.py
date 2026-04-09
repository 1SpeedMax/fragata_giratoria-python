from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('lista/', views.lista_usuarios, name='lista'),
    path('estadisticas/', views.estadisticas_usuarios, name='estadisticas'),
    path('nuevo/', views.crear_usuario, name='nuevo'),
    path('crear/', views.crear_usuario, name='crear'),
    path('editar/<int:pk>/', views.editar_usuario, name='editar'),
    path('eliminar/<int:pk>/', views.eliminar_usuario, name='eliminar'),
    path('detalle/<int:pk>/', views.detalle_usuario, name='detalle'),
    
    # Exportaciones - Nombres cortos
    path('exportar/excel/', views.export_usuarios_excel, name='export_excel'),  # <-- nombre corto
    path('exportar/pdf/', views.export_usuarios_pdf, name='export_pdf'),        # <-- nombre corto
    path('exportar/estadisticas/pdf/', views.export_estadisticas_usuarios_pdf, name='export_estadisticas_pdf'),
]