from django.shortcuts import render

# Vista para la página de contacto
def contacto_view(request):
    return render(request, 'home/contacto.html')

# Vista para la página de registro (si es parte de la misma app)
def registro_view(request):
    return render(request, 'home/contactanos.html')