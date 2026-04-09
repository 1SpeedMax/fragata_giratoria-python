from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import calendar
from collections import Counter
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import Usuario, Rol
from .forms import RegistroForm
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart

import datetime as dt

# ==================== REGISTRO DE USUARIO  ====================
def registro_view(request):

    if request.method == 'POST':
        form = RegistroForm(request.POST)

        if form.is_valid():
            nombre_usuario = form.cleaned_data['nombreUsuario']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            # 🔐 VALIDAR CONTRASEÑA
            try:
                validate_password(password)
            except ValidationError as e:
                for error in e.messages:
                    messages.error(request, error)
                return render(request, 'home/registro.html', {'form': form})

            # TU LÓGICA
            rol_cliente = Rol.objects.filter(nombre_rol='CLIENTE').first()

            usuario = Usuario(
                nombre_usuario=nombre_usuario,
                email=email,
                estado='ACTIVO',
                rol=rol_cliente
            )
            usuario.set_password(password)
            usuario.save()

            messages.success(request, "Registro exitoso")
            return redirect('login')

    else:
        form = RegistroForm()

    return render(request, 'home/registro.html', {'form': form})

# ==================== LISTA DE USUARIOS ====================
def lista_usuarios(request):
    """Vista para listar todos los usuarios"""
    usuarios = Usuario.objects.all().select_related('rol')
    
    total_usuarios = usuarios.count()
    usuarios_activos = usuarios.filter(estado='ACTIVO').count()
    usuarios_inactivos = usuarios.filter(estado='INACTIVO').count()
    usuarios_suspendidos = usuarios.filter(estado='SUSPENDIDO').count()
    
    context = {
        'usuarios': usuarios,
        'total_usuarios': total_usuarios,
        'usuarios_activos': usuarios_activos,
        'usuarios_inactivos': usuarios_inactivos,
        'usuarios_suspendidos': usuarios_suspendidos,
    }
    return render(request, 'roles/admin/Crud/usuarios/usuarios.html', context)


# ==================== ESTADÍSTICAS DE USUARIOS ====================
def estadisticas_usuarios(request):
    """Vista de estadísticas de usuarios (versión completa)"""
    usuarios = Usuario.objects.all()
    
    context = {
        'total_usuarios': usuarios.count(),
        'usuarios_activos': usuarios.filter(estado='ACTIVO').count(),
        'usuarios_inactivos': usuarios.filter(estado='INACTIVO').count(),
        'usuarios_suspendidos': usuarios.filter(estado='SUSPENDIDO').count(),
        'usuarios_por_rol': {
            'admin': usuarios.filter(rol__nombre_rol='ADMIN').count(),
            'cocinero': usuarios.filter(rol__nombre_rol='COCINERO').count(),
            'mesero': usuarios.filter(rol__nombre_rol='MESERO').count(),
            'cliente': usuarios.filter(rol__nombre_rol='CLIENTE').count(),
        }
    }
    return render(request, 'roles/admin/Crud/usuarios/estadisticas_usuarios.html', context)


# ==================== CREAR USUARIO ====================
def crear_usuario(request):
    if request.method == 'POST':
        nombre_usuario = request.POST.get('nombre_usuario')
        email = request.POST.get('email')
        password = request.POST.get('password')
        rol_id = request.POST.get('rol_id')
        estado = request.POST.get('estado', 'ACTIVO')

        if nombre_usuario and email and password and rol_id:
            if Usuario.objects.filter(email=email).exists():
                messages.error(request, "❌ El email ya está registrado")
            elif Usuario.objects.filter(nombre_usuario=nombre_usuario).exists():
                messages.error(request, "❌ El nombre de usuario ya está registrado")
            else:
                # ✅ Verificar que el rol realmente existe antes de asignarlo
                rol = Rol.objects.filter(id_rol=rol_id).first()
                if not rol:
                    messages.error(request, "❌ El rol seleccionado no existe")
                else:
                    usuario = Usuario(
                        nombre_usuario=nombre_usuario,
                        email=email,
                        estado=estado,
                        rol=rol  # ← objeto Rol, no el ID crudo
                    )
                    usuario.set_password(password)
                    usuario.save()
                    messages.success(request, f"✅ Usuario '{nombre_usuario}' creado exitosamente")
                    return redirect('usuarios:lista')
        else:
            messages.error(request, "❌ Todos los campos son obligatorios")

    roles = Rol.objects.all()  # ← esto alimenta el <select> del template
    return render(request, 'roles/admin/Crud/usuarios/crear_usuario.html', {'roles': roles})


# ==================== EDITAR USUARIO ====================
def editar_usuario(request, pk):
    """Vista para editar un usuario"""
    usuario = get_object_or_404(Usuario, id_usuario=pk)
    
    if request.method == 'POST':
        usuario.nombre_usuario = request.POST.get('nombre_usuario')
        usuario.email = request.POST.get('email')
        usuario.estado = request.POST.get('estado')
        usuario.rol_id = request.POST.get('rol_id')
        
        nueva_password = request.POST.get('nueva_password')
        if nueva_password:
            usuario.set_password(nueva_password)
        
        usuario.save()
        messages.success(request, f"✅ Usuario '{usuario.nombre_usuario}' actualizado")
        return redirect('usuarios:lista')
    
    roles = Rol.objects.all()
    context = {
        'usuario': usuario,
        'roles': roles
    }
    return render(request, 'roles/admin/Crud/usuarios/editar_usuario.html', context)


# ==================== ELIMINAR USUARIO ====================
def eliminar_usuario(request, pk):
    """Vista para eliminar un usuario"""
    usuario = get_object_or_404(Usuario, id_usuario=pk)
    
    if request.method == 'POST':
        nombre = usuario.nombre_usuario
        usuario.delete()
        messages.success(request, f"✅ Usuario '{nombre}' eliminado")
        return redirect('usuarios:lista')
    
    context = {'usuario': usuario}
    return render(request, 'roles/admin/Crud/usuarios/eliminar_usuario.html', context)


# ==================== DETALLE USUARIO ====================
def detalle_usuario(request, pk):
    """Vista para ver detalle de un usuario"""
    usuario = get_object_or_404(Usuario.objects.select_related('rol'), id_usuario=pk)
    context = {'usuario': usuario}
    return render(request, 'roles/admin/Crud/usuarios/detalle_usuario.html', context)


# ==================== EXPORTAR ESTADÍSTICAS A PDF ====================
def export_estadisticas_usuarios_pdf(request):
    """Exportar estadísticas de usuarios a PDF con gráficos"""
    usuarios = Usuario.objects.all()
    
    # KPIs principales
    total_usuarios = usuarios.count()
    usuarios_activos = usuarios.filter(estado='ACTIVO').count()
    usuarios_inactivos = usuarios.filter(estado='INACTIVO').count()
    usuarios_suspendidos = usuarios.filter(estado='SUSPENDIDO').count()
    
    # Usuarios por rol
    usuarios_admin = usuarios.filter(rol__nombre_rol='ADMIN').count()
    usuarios_cocinero = usuarios.filter(rol__nombre_rol='COCINERO').count()
    usuarios_mesero = usuarios.filter(rol__nombre_rol='MESERO').count()
    usuarios_cliente = usuarios.filter(rol__nombre_rol='CLIENTE').count()
    
    # Datos para gráficos
    estados_labels = ['Activos', 'Inactivos', 'Suspendidos']
    estados_data = [usuarios_activos, usuarios_inactivos, usuarios_suspendidos]
    
    roles_labels = ['Administradores', 'Cocineros', 'Meseros', 'Clientes']
    roles_data = [usuarios_admin, usuarios_cocinero, usuarios_mesero, usuarios_cliente]
    
    # Porcentajes
    porcentaje_activos = (usuarios_activos / total_usuarios * 100) if total_usuarios > 0 else 0
    porcentaje_inactivos = (usuarios_inactivos / total_usuarios * 100) if total_usuarios > 0 else 0
    porcentaje_suspendidos = (usuarios_suspendidos / total_usuarios * 100) if total_usuarios > 0 else 0
    
    # Crear respuesta PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="estadisticas_usuarios.pdf"'
    
    # Crear documento PDF
    doc = SimpleDocTemplate(response, pagesize=landscape(letter),
                           leftMargin=30, rightMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    story = []
    
    # Estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#d4af37'),
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#bba163'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#f5d487'),
        spaceAfter=12,
        spaceBefore=20
    )
    
    # Título
    story.append(Paragraph("LA FRAGATA GIRATORIA", title_style))
    story.append(Paragraph("Estadísticas de Usuarios", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Fecha de generación
    fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
    story.append(Paragraph(f"Fecha de generación: {fecha_actual}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # KPIs en tabla
    story.append(Paragraph("Métricas Principales", section_style))
    
    kpi_data = [
        ['Métrica', 'Valor', 'Porcentaje'],
        ['Total Usuarios', str(total_usuarios), '100%'],
        ['Usuarios Activos', str(usuarios_activos), f'{porcentaje_activos:.1f}%'],
        ['Usuarios Inactivos', str(usuarios_inactivos), f'{porcentaje_inactivos:.1f}%'],
        ['Usuarios Suspendidos', str(usuarios_suspendidos), f'{porcentaje_suspendidos:.1f}%'],
    ]
    
    kpi_table = Table(kpi_data, colWidths=[150, 120, 120])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 30))
    
    # Distribución por Estado (gráfico de torta)
    story.append(Paragraph("Distribución por Estado", section_style))
    
    if sum(estados_data) > 0:
        drawing = Drawing(400, 220)
        pie = Pie()
        pie.x = 110
        pie.y = 30
        pie.width = 180
        pie.height = 180
        pie.data = estados_data
        pie.labels = estados_labels
        pie.slices.strokeWidth = 0.5
        colores_estados = ['#10b981', '#f59e0b', '#ef4444']
        for i, color in enumerate(colores_estados):
            if i < len(pie.slices):
                pie.slices[i].fillColor = colors.HexColor(color)
        drawing.add(pie)
        story.append(drawing)
    
    story.append(Spacer(1, 20))
    
    # Tabla de estados
    estados_table_data = [['Estado', 'Cantidad', 'Porcentaje']]
    for label, value in zip(estados_labels, estados_data):
        porcentaje = (value / total_usuarios * 100) if total_usuarios > 0 else 0
        estados_table_data.append([label, str(value), f'{porcentaje:.1f}%'])
    
    estados_table = Table(estados_table_data, colWidths=[150, 100, 100])
    estados_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
    ]))
    story.append(estados_table)
    story.append(Spacer(1, 30))
    
    # Distribución por Rol (gráfico de barras)
    story.append(Paragraph("Distribución por Rol", section_style))
    
    if max(roles_data) > 0:
        drawing2 = Drawing(500, 250)
        bc = VerticalBarChart()
        bc.x = 50
        bc.y = 50
        bc.width = 400
        bc.height = 150
        bc.data = [roles_data]
        bc.categoryAxis.categoryNames = roles_labels
        bc.valueAxis.valueMin = 0
        bc.valueAxis.valueMax = max(roles_data) + (max(roles_data) * 0.2) if max(roles_data) > 0 else 10
        bc.bars[0].fillColor = colors.HexColor('#f5d487')
        bc.bars[0].strokeColor = colors.HexColor('#d4af37')
        drawing2.add(bc)
        story.append(drawing2)
    
    story.append(Spacer(1, 20))
    
    # Tabla de roles
    roles_table_data = [['Rol', 'Cantidad', 'Porcentaje']]
    for label, value in zip(roles_labels, roles_data):
        porcentaje = (value / total_usuarios * 100) if total_usuarios > 0 else 0
        roles_table_data.append([label, str(value), f'{porcentaje:.1f}%'])
    
    roles_table = Table(roles_table_data, colWidths=[150, 100, 100])
    roles_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
    ]))
    story.append(roles_table)
    story.append(Spacer(1, 30))
    
    # Información adicional
    story.append(Paragraph("Información Adicional", section_style))
    
    info_data = [
        ['Usuarios Registrados', f'{total_usuarios} usuarios'],
        ['Usuarios Activos', f'{usuarios_activos} ({porcentaje_activos:.1f}%)'],
        ['Usuarios Inactivos', f'{usuarios_inactivos} ({porcentaje_inactivos:.1f}%)'],
        ['Usuarios Suspendidos', f'{usuarios_suspendidos} ({porcentaje_suspendidos:.1f}%)'],
        ['Rol más común', max(zip(roles_labels, roles_data), key=lambda x: x[1])[0] if roles_data else 'N/A'],
    ]
    
    info_table = Table(info_data, colWidths=[150, 250])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 30))
    
    # Pie de página
    story.append(Paragraph("Reporte generado automáticamente por el sistema La Fragata Giratoria", styles['Normal']))
    story.append(Paragraph("© 2025 - Todos los derechos reservados", styles['Normal']))
    
    doc.build(story)
    return response


# ==================== EXPORTAR A EXCEL ====================
def export_usuarios_excel(request):
    """Exportar usuarios a Excel"""
    wb = Workbook()
    ws = wb.active
    ws.title = "Usuarios"
    
    fondo_negro = PatternFill(start_color="0F0F0F", end_color="0F0F0F", fill_type="solid")
    dorado = "D4AF37"
    borde_dorado = Border(
        left=Side(style="thin", color=dorado),
        right=Side(style="thin", color=dorado),
        top=Side(style="thin", color=dorado),
        bottom=Side(style="thin", color=dorado),
    )
    
    headers = ["ID", "Usuario", "Email", "Rol", "Estado", "Fecha Creación"]
    ws.append(headers)
    
    for col in ws[1]:
        col.fill = fondo_negro
        col.font = Font(color=dorado, bold=True)
        col.alignment = Alignment(horizontal="center")
        col.border = borde_dorado
    
    usuarios = Usuario.objects.all().select_related('rol')
    for u in usuarios:
        ws.append([
            u.id_usuario,
            u.nombre_usuario,
            u.email,
            u.rol.nombre_rol if u.rol else 'Sin rol',
            u.estado,
            u.fecha_creacion.strftime('%d/%m/%Y %H:%M') if u.fecha_creacion else ''
        ])
    
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.fill = fondo_negro
            cell.font = Font(color="FFFFFF")
            cell.border = borde_dorado
            cell.alignment = Alignment(horizontal="center")
    
    for col in ws.columns:
        ws.column_dimensions[col[0].column_letter].width = 18
    
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=usuarios.xlsx'
    wb.save(response)
    return response


# ==================== EXPORTAR A PDF ====================
def export_usuarios_pdf(request):
    """Exportar usuarios a PDF"""
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=usuarios.pdf'
    
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter
    y = height - 50
    
    p.setFillColor(colors.HexColor("#D4AF37"))
    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, y, "La Fragata Giratoria")
    y -= 30
    
    p.setFont("Helvetica-Bold", 16)
    p.drawString(220, y, "Listado de Usuarios")
    y -= 30
    
    p.setStrokeColor(colors.HexColor("#D4AF37"))
    p.line(40, y, 550, y)
    y -= 20
    
    usuarios = Usuario.objects.all().select_related('rol')
    p.setFont("Helvetica", 10)
    
    for u in usuarios:
        texto = f"{u.id_usuario} | {u.nombre_usuario} | {u.email} | {u.rol.nombre_rol if u.rol else ''} | {u.estado}"
        p.drawString(40, y, texto[:80])
        y -= 15
        
        if y < 40:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 10)
    
    p.save()
    return response