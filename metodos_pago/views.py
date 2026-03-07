from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q, Count
from datetime import datetime
from .models import MetodoPago

# ==================== LISTA DE MÉTODOS ====================
def lista_metodos(request):
    """Vista para listar todos los métodos de pago"""
    metodos = MetodoPago.objects.all()
    
    total_metodos = metodos.count()
    
    context = {
        'metodos': metodos,
        'total_metodos': total_metodos,
    }
    return render(request, 'roles/admin/Crud/metodospago/metodos.html', context)


# ==================== ESTADÍSTICAS ====================
def estadisticas_metodos(request):
    """Vista de estadísticas de métodos de pago"""
    metodos = MetodoPago.objects.all()
    
    # Clasificación por tipo (basada en el nombre)
    efectivo = metodos.filter(nombre_metodo__icontains='efectivo').count()
    tarjeta = metodos.filter(nombre_metodo__icontains='tarjeta').count()
    digital = metodos.filter(
        Q(nombre_metodo__icontains='nequi') |
        Q(nombre_metodo__icontains='daviplata') |
        Q(nombre_metodo__icontains='transferencia')
    ).count()
    otros = metodos.count() - (efectivo + tarjeta + digital)
    
    # Contar por longitud de descripción (solo para mostrar variedad)
    con_descripcion = metodos.exclude(descripcion__isnull=True).exclude(descripcion='').count()
    sin_descripcion = metodos.count() - con_descripcion
    
    context = {
        'total_metodos': metodos.count(),
        'metodos_por_tipo': {
            'efectivo': efectivo,
            'tarjeta': tarjeta,
            'digital': digital,
            'otros': otros,
        },
        'con_descripcion': con_descripcion,
        'sin_descripcion': sin_descripcion,
        'ultima_actualizacion': datetime.now(),
    }
    return render(request, 'roles/admin/Crud/metodospago/estadisticas_metodospago.html', context)


# ==================== CREAR MÉTODO ====================
def crear_metodo(request):
    """Vista para crear un nuevo método de pago"""
    if request.method == 'POST':
        nombre = request.POST.get('nombreMetodo')
        descripcion = request.POST.get('descripcionMetodo')
        
        if nombre:
            # Verificar si ya existe
            if MetodoPago.objects.filter(nombre_metodo__iexact=nombre).exists():
                messages.error(request, f'❌ El método "{nombre}" ya existe')
            else:
                metodo = MetodoPago(
                    nombre_metodo=nombre,
                    descripcion=descripcion,
                )
                metodo.save()
                messages.success(request, f'✅ Método "{nombre}" creado exitosamente')
                return redirect('metodos_pago:lista')
        else:
            messages.error(request, '❌ El nombre es obligatorio')
    
    return render(request, 'roles/admin/Crud/metodospago/crear_metodo.html')


# ==================== EDITAR MÉTODO ====================
def editar_metodo(request, pk):
    """Vista para editar un método de pago"""
    metodo = get_object_or_404(MetodoPago, id_metodo_pago=pk)
    
    if request.method == 'POST':
        nombre = request.POST.get('nombreMetodo')
        descripcion = request.POST.get('descripcionMetodo')
        
        if nombre:
            # Verificar si ya existe otro con el mismo nombre
            if MetodoPago.objects.filter(nombre_metodo__iexact=nombre).exclude(id_metodo_pago=pk).exists():
                messages.error(request, f'❌ El método "{nombre}" ya existe')
            else:
                metodo.nombre_metodo = nombre
                metodo.descripcion = descripcion
                metodo.save()
                messages.success(request, f'✅ Método "{nombre}" actualizado')
                return redirect('metodos_pago:lista')
        else:
            messages.error(request, '❌ El nombre es obligatorio')
    
    context = {'metodo': metodo}
    return render(request, 'roles/admin/Crud/metodospago/editar_metodo.html', context)


# ==================== ELIMINAR MÉTODO ====================
def eliminar_metodo(request, pk):
    """Vista para eliminar un método de pago"""
    metodo = get_object_or_404(MetodoPago, id_metodo_pago=pk)
    
    if request.method == 'POST':
        nombre = metodo.nombre_metodo
        metodo.delete()
        messages.success(request, f'✅ Método "{nombre}" eliminado')
        return redirect('metodos_pago:lista')
    
    context = {'metodo': metodo}
    return render(request, 'roles/admin/Crud/metodospago/eliminar_metodo.html', context)


# ==================== EXPORTAR A EXCEL ====================
def export_metodos_excel(request):
    """Exportar métodos de pago a Excel"""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Métodos de Pago"
    
    headers = ["ID", "Nombre", "Descripción"]
    ws.append(headers)
    
    # Estilo de encabezados
    for col in range(1, 4):
        cell = ws.cell(row=1, column=col)
        cell.font = Font(bold=True, color="D4AF37")
        cell.fill = PatternFill(start_color="000000", end_color="000000", fill_type="solid")
        cell.alignment = Alignment(horizontal="center")
    
    for metodo in MetodoPago.objects.all():
        ws.append([
            metodo.id_metodo_pago,
            metodo.nombre_metodo,
            metodo.descripcion or ""
        ])
    
    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response['Content-Disposition'] = 'attachment; filename=metodos_pago.xlsx'
    wb.save(response)
    return response


# ==================== EXPORTAR A PDF ====================
def export_metodos_pdf(request):
    """Exportar métodos de pago a PDF"""
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=metodos_pago.pdf'
    
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter
    y = height - 50
    
    p.setFont("Helvetica-Bold", 20)
    p.setFillColor(colors.HexColor("#D4AF37"))
    p.drawString(200, y, "La Fragata Giratoria")
    y -= 30
    p.setFont("Helvetica-Bold", 16)
    p.drawString(200, y, "Métodos de Pago")
    y -= 30
    
    p.line(40, y, 550, y)
    y -= 20
    
    p.setFont("Helvetica", 10)
    p.setFillColor(colors.white)
    
    for metodo in MetodoPago.objects.all():
        texto = f"{metodo.id_metodo_pago} | {metodo.nombre_metodo} | {metodo.descripcion or ''}"
        p.drawString(40, y, texto[:80])
        y -= 15
        if y < 40:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 10)
    
    p.save()
    return response