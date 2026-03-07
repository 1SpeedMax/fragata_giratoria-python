from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('', views.lista_usuarios, name='lista'),
    path('estadisticas/', views.estadisticas_usuarios, name='estadisticas'),  # NUEVA URL
    path('crear/', views.crear_usuario, name='crear'),
    path('editar/<int:pk>/', views.editar_usuario, name='editar'),
    path('eliminar/<int:pk>/', views.eliminar_usuario, name='eliminar'),
    path('detalle/<int:pk>/', views.detalle_usuario, name='detalle'),
    
    # Exportaciones
    path('export/excel/', views.export_usuarios_excel, name='export_excel'),
    path('export/pdf/', views.export_usuarios_pdf, name='export_pdf'),
]