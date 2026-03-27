from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import redirect
from django.http import HttpResponse
from django.db.models import Sum, F
from datetime import datetime, timedelta, date
from decimal import Decimal
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart

from productos.models import Producto
from pedidos.models import Pedido
from compras.models import Compra
from usuarios.models import Usuario


def inicio(request):
    return render(request, 'home/inicio.html')


def contacto_view(request):
    return render(request, "contacto.html")


@login_required
def dashboard(request):
    """Vista principal del dashboard con datos reales"""
    
    # ===== ESTADÍSTICAS DE PRODUCTOS =====
    total_productos = Producto.objects.count()
    
    # Productos nuevos en la última semana
    una_semana_atras = date.today() - timedelta(days=7)
    productos_nuevos = Producto.objects.filter(
        fecha_registro__gte=una_semana_atras
    ).count()
    
    # Productos con stock bajo
    productos_bajo_stock = Producto.objects.filter(
        stock_actual__lt=F('stock_minimo')
    ).order_by('stock_actual')[:5]
    
    # ===== ESTADÍSTICAS DE PEDIDOS =====
    hoy = date.today()
    pedidos_hoy = Pedido.objects.filter(fecha=hoy).count()
    pedidos_pendientes = Pedido.objects.filter(estado__iexact='PENDIENTE').count()
    
    # ===== ESTADÍSTICAS DE COMPRAS =====
    inicio_mes = date(hoy.year, hoy.month, 1)
    compras_mes = Compra.objects.filter(
        fecha__gte=inicio_mes
    ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
    
    # Calcular variación vs mes anterior
    if inicio_mes.month == 1:
        inicio_mes_anterior = date(hoy.year - 1, 12, 1)
    else:
        inicio_mes_anterior = date(hoy.year, inicio_mes.month - 1, 1)
    
    compras_mes_anterior = Compra.objects.filter(
        fecha__gte=inicio_mes_anterior,
        fecha__lt=inicio_mes
    ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
    
    if compras_mes_anterior > 0:
        compras_variacion = round(((float(compras_mes) - float(compras_mes_anterior)) / float(compras_mes_anterior)) * 100, 1)
    else:
        compras_variacion = 0
    
    # ===== ESTADÍSTICAS DE USUARIOS =====
    total_usuarios = Usuario.objects.count()
    usuarios_nuevos = Usuario.objects.filter(
        fecha_creacion__gte=inicio_mes
    ).count()
    
    # ===== ACTIVIDADES RECIENTES =====
    actividades_recientes = []
    
    # Obtener los últimos pedidos
    for pedido in Pedido.objects.all().order_by('-fecha')[:3]:
        actividades_recientes.append({
            'titulo': f'Nuevo pedido #{pedido.id_pedido}',
            'descripcion': f'{pedido.nombre_platillo} - ${pedido.total}',
            'icono': 'fa-check-circle',
            'color': 'verde',
            'fecha': pedido.fecha
        })
    
    # Obtener los últimos productos
    for producto in Producto.objects.all().order_by('-fecha_registro')[:3]:
        actividades_recientes.append({
            'titulo': f'Nuevo producto: {producto.nombre}',
            'descripcion': f'Stock: {producto.stock_actual} unidades',
            'icono': 'fa-box',
            'color': 'azul',
            'fecha': producto.fecha_registro
        })
    
    # Obtener los últimos usuarios
    for usuario in Usuario.objects.all().order_by('-fecha_creacion')[:3]:
        rol_nombre = usuario.rol.nombre_rol if usuario.rol else 'Cliente'
        actividades_recientes.append({
            'titulo': f'Nuevo usuario: {usuario.nombre_usuario}',
            'descripcion': f'Rol: {rol_nombre}',
            'icono': 'fa-user-plus',
            'color': 'amarillo',
            'fecha': usuario.fecha_creacion
        })
    
    # Ordenar por fecha (manejar correctamente None)
    def get_fecha(actividad):
        fecha = actividad.get('fecha')
        if fecha is None:
            return datetime.min.date()
        # Si es datetime, convertirlo a date
        if isinstance(fecha, datetime):
            return fecha.date()
        return fecha
    
    actividades_recientes.sort(key=get_fecha, reverse=True)
    actividades_recientes = actividades_recientes[:5]
    
    # ===== DATOS PARA GRÁFICO =====
    ventas_semana = []
    dias_semana = []
    
    for i in range(6, -1, -1):
        fecha = hoy - timedelta(days=i)
        dias_semana.append(fecha.strftime('%a'))
        ventas_dia = Pedido.objects.filter(fecha=fecha).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        ventas_semana.append(float(ventas_dia) / 1000000)
    
    ventas_mes = []
    for i in range(0, 4):
        inicio_semana = inicio_mes + timedelta(days=i*7)
        fin_semana = inicio_semana + timedelta(days=6)
        ventas_semana_mes = Pedido.objects.filter(
            fecha__gte=inicio_semana,
            fecha__lte=fin_semana
        ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        ventas_mes.append(float(ventas_semana_mes) / 1000000)
    
    context = {
        'total_productos': total_productos,
        'productos_nuevos': productos_nuevos,
        'productos_bajo_stock': productos_bajo_stock,
        'pedidos_hoy': pedidos_hoy,
        'pedidos_pendientes': pedidos_pendientes,
        'compras_mes': compras_mes,
        'compras_variacion': compras_variacion,
        'total_usuarios': total_usuarios,
        'usuarios_nuevos': usuarios_nuevos,
        'actividades_recientes': actividades_recientes,
        'ventas_semana': ventas_semana,
        'dias_semana': dias_semana,
        'ventas_mes': ventas_mes,
    }
    
    return render(request, 'roles/admin/dashboard.html', context)


def exportar_reporte_pdf(request):
    """Exportar reporte del dashboard a PDF"""
    
    # Obtener datos para el reporte
    hoy = date.today()
    inicio_mes = date(hoy.year, hoy.month, 1)
    
    total_productos = Producto.objects.count()
    pedidos_hoy = Pedido.objects.filter(fecha=hoy).count()
    pedidos_pendientes = Pedido.objects.filter(estado__iexact='PENDIENTE').count()
    total_usuarios = Usuario.objects.count()
    
    compras_mes = Compra.objects.filter(
        fecha__gte=inicio_mes
    ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
    
    # Datos para gráficos
    ventas_semana = []
    dias_semana = []
    for i in range(6, -1, -1):
        fecha = hoy - timedelta(days=i)
        dias_semana.append(fecha.strftime('%a'))
        ventas_dia = Pedido.objects.filter(fecha=fecha).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        ventas_semana.append(float(ventas_dia) / 1000000)
    
    # Últimas actividades
    ultimas_actividades = []
    for pedido in Pedido.objects.all().order_by('-fecha')[:5]:
        ultimas_actividades.append([f'Pedido #{pedido.id_pedido}', pedido.nombre_platillo, f'${pedido.total}'])
    
    # Crear respuesta PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_dashboard.pdf"'
    
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
    story.append(Paragraph("Reporte del Dashboard", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Fecha de generación
    fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
    story.append(Paragraph(f"Fecha de generación: {fecha_actual}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # KPIs en tabla
    story.append(Paragraph("Métricas Principales", section_style))
    
    kpi_data = [
        ['Métrica', 'Valor'],
        ['Total Productos', str(total_productos)],
        ['Pedidos Hoy', str(pedidos_hoy)],
        ['Pedidos Pendientes', str(pedidos_pendientes)],
        ['Compras del Mes', f'${int(compras_mes):,}'],
        ['Total Usuarios', str(total_usuarios)],
    ]
    
    kpi_table = Table(kpi_data, colWidths=[150, 150])
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
    
    # Gráfico de ventas
    story.append(Paragraph("Ventas de la Semana", section_style))
    
    if max(ventas_semana) > 0:
        drawing = Drawing(500, 250)
        bc = VerticalBarChart()
        bc.x = 50
        bc.y = 50
        bc.width = 400
        bc.height = 150
        bc.data = [ventas_semana]
        bc.categoryAxis.categoryNames = dias_semana
        bc.valueAxis.valueMin = 0
        bc.bars[0].fillColor = colors.HexColor('#f5d487')
        drawing.add(bc)
        story.append(drawing)
    
    story.append(Spacer(1, 20))
    
    # Tabla de ventas
    ventas_data = [['Día', 'Ventas (Millones $)']]
    for i, dia in enumerate(dias_semana):
        ventas_data.append([dia, f'${ventas_semana[i]:.1f}M'])
    
    ventas_table = Table(ventas_data, colWidths=[100, 150])
    ventas_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
    ]))
    story.append(ventas_table)
    story.append(Spacer(1, 30))
    
    # Actividades recientes
    story.append(Paragraph("Actividades Recientes", section_style))
    
    if ultimas_actividades:
        actividades_data = [['Tipo', 'Descripción', 'Total']] + ultimas_actividades
        actividades_table = Table(actividades_data, colWidths=[100, 200, 100])
        actividades_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
        ]))
        story.append(actividades_table)
    else:
        story.append(Paragraph("No hay actividades recientes", styles['Normal']))
    
    story.append(Spacer(1, 30))
    
    # Pie de página
    story.append(Paragraph("Reporte generado automáticamente por el sistema La Fragata Giratoria", styles['Normal']))
    story.append(Paragraph("© 2025 - Todos los derechos reservados", styles['Normal']))
    
    doc.build(story)
    return response


def cerrar_sesion(request):
    logout(request)
    messages.success(request, "Has cerrado sesión correctamente.")
    return redirect('inicio')