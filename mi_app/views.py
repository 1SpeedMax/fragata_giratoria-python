from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import redirect

# ELIMINA ESTA LÍNEA - CAUSA LA IMPORTACIÓN CIRCULAR
# from mi_app.views import inicio, dashboard, cerrar_sesion, contacto_view

def inicio(request):
    return render(request, 'home/inicio.html')

def contacto_view(request):
    return render(request, "contacto.html")

@login_required
def dashboard(request):
    # Contexto opcional para estadísticas o datos de tu dashboard
    context = {
        'total_productos': 120,       # ejemplo
        'productos_bajo_stock': 5,    # ejemplo
    }
    # Apunta a tu template personalizado
    return render(request, 'roles/admin/dashboard.html', context)

def cerrar_sesion(request):
    logout(request)
    messages.success(request, "Has cerrado sesión correctamente.")
    return redirect('inicio')