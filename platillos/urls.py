from django.urls import path
from . import views

app_name = 'platillos'  

urlpatterns = [
    # Lista principal de platillos
    path('', views.PlatilloListView.as_view(), name='lista'),
    
    # Estadísticas
    path('estadisticas/', views.estadisticas_platillos, name='estadisticas'),
    path('estadisticas/export/pdf/', views.export_estadisticas_platillos_pdf, name='export_estadisticas_pdf'),
    
    # CRUD Platillos
    path('platillos_crear/', views.PlatilloCreateView.as_view(), name='crear'),
    path('platillos_editar/<int:pk>/', views.PlatilloUpdateView.as_view(), name='editar'),
    path('platillos_eliminar/<int:pk>/', views.PlatilloDeleteView.as_view(), name='eliminar'),
    path('platillos_detalle/<int:pk>/', views.detalle_platillo, name='detalle'),

    
    # Exportaciones
    path('export/excel/', views.export_platillos_excel, name='export_excel'),
    path('export/pdf/', views.export_platillos_pdf, name='export_pdf'),

    #MENU
    path('menu/', views.menu, name='menu'),

]