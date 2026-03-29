from django.shortcuts import render
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib import messages

def ajustes(request):
    """Vista de ajustes del sistema"""
    return render(request, 'roles/admin/ajustes.html')

def ayuda(request):
    """Vista de ayuda del sistema"""
    return render(request, 'roles/admin/ayuda.html')