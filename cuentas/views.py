# contacto/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistroForm  # Asegúrate de tener este formulario definido en forms.py

def registro_view(request):
    if request.method == "POST":
        form = RegistroForm(request.POST)
        if form.is_valid():
            user = form.save()  # Guarda el usuario
            login(request, user)  # Lo loguea automáticamente
            return redirect("/")  # Redirige al inicio
    else:
        form = RegistroForm()

    # Se asegura de que Django busque el template en la carpeta correcta
    return render(request, "home/registro.html", {"form": form})