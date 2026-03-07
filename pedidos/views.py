from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import calendar

from .models import Pedido, Cliente
from usuarios.models import Usuario
from metodos_pago.models import MetodoPago
from productos.models import Producto

# ==================== LISTA DE PEDIDOS ====================
def lista_pedidos(request):
    """Vista principal que lista todos los pedidos"""
    pedidos = Pedido.objects.all().order_by('-fecha')
    
    # Estadísticas básicas
    total_pedidos = pedidos.count()
    monto_pendiente = pedidos.filter(estado__iexact='PENDIENTE').aggregate(Sum('total'))['total__sum'] or 0
    pedidos_hoy = pedidos.filter(fecha=datetime.now().date()).count()
    
    # Búsqueda
    query = request.GET.get('q')
    if query:
        pedidos = pedidos.filter(
            Q(id_pedido__icontains=query) |
            Q(nombre_platillo__icontains=query) |
            Q(estado__icontains=query)
        )
    
    context = {
        'pedidos': pedidos,
        'total_pedidos': total_pedidos,
        'monto_pendiente': monto_pendiente,
        'pedidos_hoy': pedidos_hoy,
    }
    return render(request, 'roles/admin/Crud/pedidos/pedidos.html', context)


# ==================== ESTADÍSTICAS DE PEDIDOS ====================
def estadisticas_pedidos(request):
    """Vista de estadísticas de pedidos"""
    pedidos = Pedido.objects.all()
    hoy = datetime.now().date()
    
    # KPIs principales
    total_pedidos = pedidos.count()
    pedidos_pendientes = pedidos.filter(estado__iexact='PENDIENTE').count()
    pedidos_enviados = pedidos.filter(estado__iexact='ENVIADO').count()
    pedidos_entregados = pedidos.filter(estado__iexact='ENTREGADO').count()
    pedidos_cancelados = pedidos.filter(estado__iexact='CANCELADO').count()
    
    ingresos_totales = pedidos.filter(estado='ENTREGADO').aggregate(Sum('total'))['total__sum'] or 0
    ticket_promedio = pedidos.aggregate(Avg('total'))['total__avg'] or 0
    
    # Pedidos por mes (últimos 6 meses)
    pedidos_por_mes = []
    montos_por_mes = []
    meses_labels = []
    
    for i in range(5, -1, -1):
        fecha = hoy - timedelta(days=30*i)
        mes_nombre = calendar.month_abbr[fecha.month]
        meses_labels.append(mes_nombre)
        
        pedidos_mes = pedidos.filter(
            fecha__year=fecha.year,
            fecha__month=fecha.month
        )
        pedidos_por_mes.append(pedidos_mes.count())
        montos_por_mes.append(float(pedidos_mes.aggregate(Sum('total'))['total__sum'] or 0))
    
    # Datos adicionales
    from collections import Counter
    platillos = [p.nombre_platillo for p in pedidos if p.nombre_platillo]
    platillo_favorito = Counter(platillos).most_common(1)[0][0] if platillos else "N/A"
    
    context = {
        'total_pedidos': total_pedidos,
        'pedidos_pendientes': pedidos_pendientes,
        'pedidos_enviados': pedidos_enviados,
        'pedidos_entregados': pedidos_entregados,
        'pedidos_cancelados': pedidos_cancelados,
        'ingresos_totales': ingresos_totales,
        'ticket_promedio': ticket_promedio,
        'pedidos_por_mes': pedidos_por_mes,
        'montos_por_mes': montos_por_mes,
        'meses_labels': meses_labels,
        'platillo_favorito': platillo_favorito,
    }
    
    return render(request, 'roles/admin/Crud/pedidos/estadisticas_pedidos.html', context)


# ==================== CREAR PEDIDO ====================
def crear_pedido(request):
    """Vista para crear un nuevo pedido"""
    if request.method == 'POST':
        try:
            pedido = Pedido(
                cantidad=request.POST.get('cantidad'),
                estado=request.POST.get('estado', 'PENDIENTE'),
                fecha=request.POST.get('fecha') or datetime.now().date(),
                id_adicional=request.POST.get('id_adicional'),
                id_platillo=request.POST.get('id_platillo'),
                nombre_platillo=request.POST.get('nombre_platillo'),
                observaciones=request.POST.get('observaciones'),
                precio_unitario=request.POST.get('precio_unitario'),
                subtotal=request.POST.get('subtotal'),
                total=request.POST.get('total'),
            )
            
            if request.POST.get('id_cliente'):
                pedido.id_cliente_id = request.POST.get('id_cliente')
            if request.POST.get('id_usuario'):
                pedido.id_usuario_id = request.POST.get('id_usuario')
            if request.POST.get('id_metodo_pago'):
                pedido.id_metodo_pago_id = request.POST.get('id_metodo_pago')
            
            pedido.save()
            messages.success(request, '✅ Pedido creado exitosamente')
            return redirect('pedidos:lista')
        except Exception as e:
            messages.error(request, f'❌ Error al crear pedido: {str(e)}')
    
    context = {
        'clientes': Cliente.objects.all(),
        'usuarios': Usuario.objects.all(),
        'metodos_pago': MetodoPago.objects.all(),
        'platillos': Producto.objects.all(),
        'hoy': datetime.now().date(),
    }
    # CORREGIDO: usar pedidos_crear.html en lugar de crear_pedido.html
    return render(request, 'roles/admin/Crud/pedidos/pedidos_crear.html', context)


# ==================== EDITAR PEDIDO ====================
def editar_pedido(request, pk):
    """Vista para editar un pedido existente"""
    pedido = get_object_or_404(Pedido, id_pedido=pk)
    
    if request.method == 'POST':
        try:
            pedido.cantidad = request.POST.get('cantidad')
            pedido.estado = request.POST.get('estado')
            pedido.fecha = request.POST.get('fecha')
            pedido.id_adicional = request.POST.get('id_adicional')
            pedido.id_platillo = request.POST.get('id_platillo')
            pedido.nombre_platillo = request.POST.get('nombre_platillo')
            pedido.observaciones = request.POST.get('observaciones')
            pedido.precio_unitario = request.POST.get('precio_unitario')
            pedido.subtotal = request.POST.get('subtotal')
            pedido.total = request.POST.get('total')
            
            pedido.id_cliente_id = request.POST.get('id_cliente') or None
            pedido.id_usuario_id = request.POST.get('id_usuario') or None
            pedido.id_metodo_pago_id = request.POST.get('id_metodo_pago') or None
            
            pedido.save()
            messages.success(request, '✅ Pedido actualizado exitosamente')
            return redirect('pedidos:lista')
        except Exception as e:
            messages.error(request, f'❌ Error al actualizar: {str(e)}')
    
    context = {
        'pedido': pedido,
        'clientes': Cliente.objects.all(),
        'usuarios': Usuario.objects.all(),
        'metodos_pago': MetodoPago.objects.all(),
        'platillos': Producto.objects.all(),
    }
    # CORREGIDO: usar pedidos_editar.html en lugar de editar_pedido.html
    return render(request, 'roles/admin/Crud/pedidos/pedidos_editar.html', context)


# ==================== ELIMINAR PEDIDO ====================
def eliminar_pedido(request, pk):
    """Vista para eliminar un pedido"""
    pedido = get_object_or_404(Pedido, id_pedido=pk)
    
    if request.method == 'POST':
        try:
            pedido.delete()
            messages.success(request, '✅ Pedido eliminado exitosamente')
        except Exception as e:
            messages.error(request, f'❌ Error al eliminar: {str(e)}')
        return redirect('pedidos:lista')
    
    context = {'pedido': pedido}
    return render(request, 'roles/admin/Crud/pedidos/eliminar_pedido.html', context)


# ==================== DETALLE PEDIDO ====================
def detalle_pedido(request, pk):
    """Vista para ver detalle de un pedido"""
    pedido = get_object_or_404(Pedido, id_pedido=pk)
    context = {'pedido': pedido}
    return render(request, 'roles/admin/Crud/pedidos/detalle_pedido.html', context)


# ==================== EXPORTAR A EXCEL ====================
def export_pedidos_excel(request):
    """Exportar pedidos a Excel"""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Pedidos"
    
    header_font = Font(bold=True, color="D4AF37")
    header_fill = PatternFill(start_color="000000", end_color="000000", fill_type="solid")
    
    headers = ["ID", "Cliente", "Fecha", "Platillo", "Cantidad", "Precio Unit.", "Subtotal", "Total", "Estado"]
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center")
    
    for row_num, p in enumerate(Pedido.objects.all(), 2):
        ws.cell(row=row_num, column=1, value=p.id_pedido)
        ws.cell(row=row_num, column=2, value=p.id_cliente.nombre if p.id_cliente else '')
        ws.cell(row=row_num, column=3, value=p.fecha.strftime("%d/%m/%Y") if p.fecha else '')
        ws.cell(row=row_num, column=4, value=p.nombre_platillo)
        ws.cell(row=row_num, column=5, value=p.cantidad)
        ws.cell(row=row_num, column=6, value=float(p.precio_unitario) if p.precio_unitario else 0)
        ws.cell(row=row_num, column=7, value=float(p.subtotal) if p.subtotal else 0)
        ws.cell(row=row_num, column=8, value=float(p.total) if p.total else 0)
        ws.cell(row=row_num, column=9, value=p.estado)
    
    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response['Content-Disposition'] = 'attachment; filename=pedidos.xlsx'
    wb.save(response)
    return response


# ==================== EXPORTAR A PDF ====================
def export_pedidos_pdf(request):
    """Exportar pedidos a PDF"""
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=pedidos.pdf'
    
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter
    y = height - 50
    
    p.setFont("Helvetica-Bold", 20)
    p.setFillColor(colors.HexColor("#D4AF37"))
    p.drawString(200, y, "La Fragata Giratoria")
    y -= 30
    p.setFont("Helvetica-Bold", 16)
    p.drawString(220, y, "Listado de Pedidos")
    y -= 30
    
    p.setStrokeColor(colors.HexColor("#D4AF37"))
    p.line(40, y, 550, y)
    y -= 20
    
    p.setFont("Helvetica", 9)
    p.setFillColor(colors.white)
    
    for pedido in Pedido.objects.all():
        if y < 40:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 9)
            p.setFillColor(colors.white)
        
        texto = f"{pedido.id_pedido} | {pedido.nombre_platillo} | {pedido.fecha} | ${pedido.total} | {pedido.estado}"
        p.drawString(40, y, texto[:90])
        y -= 15
    
    p.save()
    return response