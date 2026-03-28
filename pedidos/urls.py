from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('', views.lista_pedidos, name='lista'),
    path('nuevo/', views.crear_pedido, name='nuevo'),
    path('detalle/<int:id_pedido>/', views.detalle_pedido, name='detalle'),
    path('editar/<int:id_pedido>/', views.editar_pedido, name='editar'),
    path('eliminar/<int:id_pedido>/', views.eliminar_pedido, name='eliminar'),
    path('estadisticas/', views.estadisticas_pedidos, name='estadisticas'),
    path('exportar/excel/', views.exportar_excel, name='export_excel'),
    path('exportar/pdf/', views.exportar_pdf, name='export_pdf'),
]