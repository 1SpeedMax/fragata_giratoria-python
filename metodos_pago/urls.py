from django.urls import path
from . import views

app_name = 'metodos_pago'

urlpatterns = [
    path('', views.lista_metodos, name='lista'),
    path('estadisticas/', views.estadisticas_metodos, name='estadisticas'),
    path('crear/', views.crear_metodo, name='crear'),
    path('editar/<int:pk>/', views.editar_metodo, name='editar'),
    path('eliminar/<int:pk>/', views.eliminar_metodo, name='eliminar'),
    path('export/excel/', views.export_metodos_excel, name='export_excel'),
    path('export/pdf/', views.export_metodos_pdf, name='export_pdf'),
]