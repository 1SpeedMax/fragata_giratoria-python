from django.shortcuts import render

def ajustes(request):
    """Vista de ajustes del sistema"""
    return render(request, 'roles/admin/ajustes.html')

def ayuda(request):
    """Vista de ayuda del sistema"""
    return render(request, 'roles/admin/ayuda.html')