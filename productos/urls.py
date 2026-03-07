from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    path('', views.ProductoListView.as_view(), name='lista'),
    path('estadisticas/', views.estadisticas_productos, name='estadisticas'),
    path('crear/', views.ProductoCreateView.as_view(), name='crear'),
    path('editar/<int:pk>/', views.ProductoUpdateView.as_view(), name='editar'),
    path('eliminar/<int:pk>/', views.ProductoDeleteView.as_view(), name='eliminar'),
    path('detalle/<int:pk>/', views.detalle_producto, name='detalle'),  # <-- AGREGAR
    path('export/excel/', views.export_productos_excel, name='export_excel'),
    path('export/pdf/', views.export_productos_pdf, name='export_pdf'),
]