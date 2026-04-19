from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    # Cambia views.lista_pedidos por views.ProductoListView.as_view()
    path('', views.ProductoListView.as_view(), name='lista'),
    
    # Asegúrate de que las demás rutas coincidan con los nombres en views.py
    path('crear/', views.crear_producto, name='crear'),
    path('editar/<int:pk>/', views.ProductoUpdateView.as_view(), name='editar'),
    path('eliminar/<int:pk>/', views.ProductoDeleteView.as_view(), name='eliminar'),
    path('detalle/<int:pk>/', views.detalle_producto, name='detalle'),
    path('exportar-estadisticas/pdf/', views.export_estadisticas_pdf, name='export_estadisticas_pdf'),
    
    # Exportaciones
    path('exportar/excel/', views.export_productos_excel, name='export_excel'),
    path('exportar-seleccionados/', views.exportar_seleccionados, name='exportar_seleccionados'),
    path('exportar/pdf/', views.export_productos_pdf, name='export_pdf'),
    path('estadisticas/', views.estadisticas_productos, name='estadisticas'),
]