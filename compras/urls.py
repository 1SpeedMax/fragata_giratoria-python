from django.urls import path
from . import views

app_name = 'compras'

urlpatterns = [
    # Redirigir la raíz a estadísticas (opcional)
    path('', views.CompraEstadisticasView.as_view(), name='lista'),
    
    # Estadísticas
    path('estadisticas/', views.CompraEstadisticasView.as_view(), name='estadisticas'),
    
    # Tabla
    path('tabla/', views.CompraTablaView.as_view(), name='tabla'),
    
    # CRUD
    path('nuevo/', views.CompraCreateView.as_view(), name='nuevo'),
    path('editar/<int:pk>/', views.CompraUpdateView.as_view(), name='editar'),
    path('eliminar/<int:pk>/', views.CompraDeleteView.as_view(), name='eliminar'),

    # Exportaciones
    path('export/pdf/', views.export_compras_pdf, name='export_pdf'),
    path('export/excel/', views.export_compras_excel, name='export_excel'),
]