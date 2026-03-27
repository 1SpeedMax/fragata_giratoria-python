# pedidos/urls.py

from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.lista_pedidos, name='lista'),
    path('estadisticas/', views.estadisticas_pedidos, name='estadisticas'),
    path('estadisticas/export/pdf/', views.export_estadisticas_pdf, name='export_estadisticas_pdf'),
    path('nuevo/', views.crear_pedido, name='nuevo'),
    path('editar/<int:pk>/', views.editar_pedido, name='editar'),
    path('eliminar/<int:pk>/', views.eliminar_pedido, name='eliminar'),
    path('detalle/<int:pk>/', views.detalle_pedido, name='detalle'),
    path('export/excel/', views.export_pedidos_excel, name='export_excel'),
    path('export/pdf/', views.export_pedidos_pdf, name='export_pdf'),
]