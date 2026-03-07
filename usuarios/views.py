from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q
from .models import Usuario, Rol
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import datetime

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
    """Vista para crear un nuevo usuario"""
    if request.method == 'POST':
        nombre_usuario = request.POST.get('nombre_usuario')
        email = request.POST.get('email')
        password = request.POST.get('password')
        rol_id = request.POST.get('rol_id')
        estado = request.POST.get('estado', 'ACTIVO')
        
        if nombre_usuario and email and password:
            # Verificar si ya existe
            if Usuario.objects.filter(email=email).exists():
                messages.error(request, "❌ El email ya está registrado")
            else:
                usuario = Usuario(
                    nombre_usuario=nombre_usuario,
                    email=email,
                    estado=estado,
                    rol_id=rol_id
                )
                usuario.set_password(password)
                usuario.save()
                messages.success(request, f"✅ Usuario '{nombre_usuario}' creado exitosamente")
                return redirect('usuarios:lista')
        else:
            messages.error(request, "❌ Todos los campos son obligatorios")
    
    roles = Rol.objects.all()
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


# ==================== REGISTRO DE USUARIO (público) ====================
def registro_view(request):
    """Vista pública de registro de usuarios"""
    if request.method == 'POST':
        nombre_usuario = request.POST.get('nombre_usuario')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if nombre_usuario and email and password:
            # Verificar si ya existe
            if Usuario.objects.filter(email=email).exists():
                messages.error(request, "❌ El email ya está registrado")
            else:
                # Asignar rol por defecto (cliente)
                rol_cliente = Rol.objects.filter(nombre_rol='CLIENTE').first()
                
                usuario = Usuario(
                    nombre_usuario=nombre_usuario,
                    email=email,
                    estado='ACTIVO',
                    rol=rol_cliente
                )
                usuario.set_password(password)
                usuario.save()
                messages.success(request, "✅ Registro exitoso. Ahora puedes iniciar sesión.")
                return redirect('login')
        else:
            messages.error(request, "❌ Todos los campos son obligatorios")
    
    return render(request, 'home/registro.html')


# ==================== EXPORTAR A EXCEL ====================
def export_usuarios_excel(request):
    """Exportar usuarios a Excel"""
    wb = Workbook()
    ws = wb.active
    ws.title = "Usuarios"
    
    headers = ["ID", "Usuario", "Email", "Rol", "Estado", "Fecha Creación"]
    ws.append(headers)
    
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
    
    p.setFont("Helvetica-Bold", 20)
    p.setFillColor(colors.HexColor("#D4AF37"))
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
    p.setFillColor(colors.white)
    
    for u in usuarios:
        texto = f"{u.id_usuario} | {u.nombre_usuario} | {u.email} | {u.rol.nombre_rol if u.rol else ''} | {u.estado}"
        p.drawString(40, y, texto[:80])  # Limitar longitud
        y -= 15
        
        if y < 40:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 10)
            p.setFillColor(colors.white)
    
    p.save()
    return response