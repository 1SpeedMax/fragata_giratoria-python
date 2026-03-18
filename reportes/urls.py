from django.urls import path
from django.http import HttpResponse

app_name = 'reportes'

def placeholder(request):
    return HttpResponse("🚧 Sección en construcción")

urlpatterns = [
    path('ventas/', placeholder, name='ventas'),
    path('inventario/', placeholder, name='inventario'),
    path('compras/', placeholder, name='compras'),
]