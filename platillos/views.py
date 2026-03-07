# platillos/views.py
from django.shortcuts import render

def platillos_list(request):
    return render(request, 'roles/admin/Crud/platillos/platillos.html')