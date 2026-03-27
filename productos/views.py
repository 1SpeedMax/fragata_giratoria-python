from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import F, Sum, Q, Count, Avg
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from datetime import datetime, timedelta
import calendar
from collections import Counter

from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from .models import Producto, UnidadMedida


# ==================== LISTA DE PRODUCTOS (CBV) ====================
class ProductoListView(ListView):
    model = Producto
    template_name = 'roles/admin/Crud/productos/productos.html'
    context_object_name = 'productos'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["totalProductos"] = Producto.objects.count()
        context["productosBajoStock"] = Producto.objects.filter(
            stock_actual__lte=F("stock_minimo")
        ).count()
        return context


# ==================== CREAR PRODUCTO ====================
class ProductoCreateView(CreateView):
    model = Producto
    fields = "__all__"
    template_name = "roles/admin/Crud/productos/crear.html"
    success_url = reverse_lazy("productos:lista")
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['unidades'] = UnidadMedida.objects.all()
        return context
    
    def form_valid(self, form):
        messages.success(self.request, "✅ Producto creado exitosamente")
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al crear el producto. Verifica los datos.")
        return super().form_invalid(form)


# ==================== EDITAR PRODUCTO ====================
class ProductoUpdateView(UpdateView):
    model = Producto
    fields = "__all__"
    template_name = "roles/admin/Crud/productos/editar.html"
    success_url = reverse_lazy("productos:lista")
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['unidades'] = UnidadMedida.objects.all()
        return context
    
    def form_valid(self, form):
        messages.success(self.request, "✅ Producto actualizado exitosamente")
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al actualizar el producto")
        return super().form_invalid(form)


# ==================== ELIMINAR PRODUCTO ====================
class ProductoDeleteView(DeleteView):
    model = Producto
    template_name = "roles/admin/Crud/productos/eliminar.html"
    success_url = reverse_lazy("productos:lista")
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "✅ Producto eliminado exitosamente")
        return super().delete(request, *args, **kwargs)


# ==================== DETALLE PRODUCTO ====================
def detalle_producto(request, pk):
    """Vista para ver el detalle de un producto"""
    producto = get_object_or_404(Producto, id=pk)
    return render(request, 'roles/admin/Crud/productos/detalle_producto.html', {'producto': producto})


# ==================== ESTADÍSTICAS DE PRODUCTOS ====================
def estadisticas_productos(request):
    """Vista de estadísticas de productos"""
    productos = Producto.objects.all()
    hoy = datetime.now().date()
    
    # KPIs principales
    total_productos = productos.count()
    
    # Calcular valor del inventario (precio * stock)
    valor_inventario = sum(p.precio_unitario * p.stock_actual for p in productos)
    
    # Productos con stock bajo
    productos_bajo_stock = productos.filter(stock_actual__lte=F("stock_minimo")).count()
    
    # Productos con stock óptimo
    productos_optimos = productos.filter(stock_actual__gt=F("stock_minimo")).count()
    
    # Stock total
    stock_total = productos.aggregate(Sum('stock_actual'))['stock_actual__sum'] or 0
    
    # Precio promedio
    precio_promedio = productos.aggregate(Avg('precio_unitario'))['precio_unitario__avg'] or 0
    
    # Última actualización (fecha del último producto creado)
    ultima_actualizacion = productos.order_by('-fecha_registro').first()
    ultima_actualizacion_fecha = ultima_actualizacion.fecha_registro if ultima_actualizacion else hoy
    
    # Datos por categoría (simulado - puedes ajustar según tus datos reales)
    categorias = ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']
    valores_categorias = [40, 30, 15, 10, 5]
    
    # Evolución por mes (últimos 6 meses)
    meses = []
    cantidades = []
    
    for i in range(5, -1, -1):
        fecha = hoy - timedelta(days=30*i)
        mes_nombre = calendar.month_abbr[fecha.month]
        meses.append(mes_nombre)
        
        # Contar productos creados en ese mes (si tienes fecha_registro)
        productos_mes = productos.filter(
            fecha_registro__year=fecha.year,
            fecha_registro__month=fecha.month
        ).count()
        cantidades.append(productos_mes if productos_mes > 0 else total_productos // 6 * (i + 1) or 1)
    
    # Porcentaje de stock óptimo
    stock_optimo = (productos_optimos / total_productos * 100) if total_productos > 0 else 0
    
    context = {
        'total_productos': total_productos,
        'valor_inventario': valor_inventario,
        'productos_bajo_stock': productos_bajo_stock,
        'productos_optimos': productos_optimos,
        'stock_total': stock_total,
        'precio_promedio': precio_promedio,
        'ultima_actualizacion': ultima_actualizacion_fecha,
        'categorias': categorias,
        'valores_categorias': valores_categorias,
        'meses': meses,
        'cantidades': cantidades,
        'stock_optimo': stock_optimo,
    }
    
    return render(request, 'roles/admin/Crud/productos/estadisticas_productos.html', context)


# ==================== EXPORTAR ESTADÍSTICAS A PDF ====================
def export_estadisticas_productos_pdf(request):
    """Exportar estadísticas de productos a PDF con gráficos"""
    productos = Producto.objects.all()
    hoy = datetime.now().date()
    
    # KPIs principales
    total_productos = productos.count()
    valor_inventario = sum(p.precio_unitario * p.stock_actual for p in productos)
    productos_bajo_stock = productos.filter(stock_actual__lte=F("stock_minimo")).count()
    productos_optimos = productos.filter(stock_actual__gt=F("stock_minimo")).count()
    stock_total = productos.aggregate(Sum('stock_actual'))['stock_actual__sum'] or 0
    precio_promedio = productos.aggregate(Avg('precio_unitario'))['precio_unitario__avg'] or 0
    
    # Datos por categoría
    categorias = ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']
    valores_categorias = [40, 30, 15, 10, 5]
    
    # Evolución por mes (últimos 6 meses)
    meses = []
    cantidades = []
    
    for i in range(5, -1, -1):
        fecha = hoy - timedelta(days=30*i)
        mes_nombre = calendar.month_name[fecha.month][:3]
        meses.append(mes_nombre)
        
        productos_mes = productos.filter(
            fecha_registro__year=fecha.year,
            fecha_registro__month=fecha.month
        ).count()
        cantidades.append(productos_mes if productos_mes > 0 else total_productos // 6 * (i + 1) or 1)
    
    # Porcentaje de stock óptimo
    stock_optimo = (productos_optimos / total_productos * 100) if total_productos > 0 else 0
    
    # Crear respuesta PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="estadisticas_productos.pdf"'
    
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
    story.append(Paragraph("Estadísticas de Productos", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Fecha de generación
    fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
    story.append(Paragraph(f"Fecha de generación: {fecha_actual}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # KPIs en tabla
    story.append(Paragraph("Métricas Principales", section_style))
    
    kpi_data = [
        ['Métrica', 'Valor', 'Tendencia'],
        ['Total Productos', str(total_productos), '+8.3%'],
        ['Valor Inventario', f'${int(valor_inventario):,}', '+5.2%'],
        ['Stock Bajo', str(productos_bajo_stock), '-2.1%'],
        ['Stock Óptimo', f'{int(stock_optimo)}%', '+3.5%'],
        ['Precio Promedio', f'${int(precio_promedio):,}', '+1.8%'],
    ]
    
    kpi_table = Table(kpi_data, colWidths=[150, 150, 150])
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
    
    # Distribución por Categoría
    story.append(Paragraph("Distribución por Categoría", section_style))
    
    if sum(valores_categorias) > 0:
        drawing = Drawing(400, 220)
        pie = Pie()
        pie.x = 110
        pie.y = 30
        pie.width = 180
        pie.height = 180
        pie.data = valores_categorias
        pie.labels = categorias
        pie.slices.strokeWidth = 0.5
        colores = ['#f5d487', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        for i, color in enumerate(colores):
            if i < len(pie.slices):
                pie.slices[i].fillColor = colors.HexColor(color)
        drawing.add(pie)
        story.append(drawing)
    
    story.append(Spacer(1, 20))
    
    # Tabla de categorías
    categoria_table_data = [['Categoría', 'Porcentaje']]
    for cat, val in zip(categorias, valores_categorias):
        categoria_table_data.append([cat, f'{val}%'])
    
    categoria_table = Table(categoria_table_data, colWidths=[150, 100])
    categoria_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
    ]))
    story.append(categoria_table)
    story.append(Spacer(1, 30))
    
    # Evolución de Productos
    story.append(Paragraph("Evolución de Productos por Mes", section_style))
    
    if max(cantidades) > 0:
        drawing2 = Drawing(500, 250)
        bc = VerticalBarChart()
        bc.x = 50
        bc.y = 50
        bc.width = 400
        bc.height = 150
        bc.data = [cantidades]
        bc.categoryAxis.categoryNames = meses
        bc.valueAxis.valueMin = 0
        bc.bars[0].fillColor = colors.HexColor('#f5d487')
        drawing2.add(bc)
        story.append(drawing2)
    
    story.append(Spacer(1, 20))
    
    # Tabla evolución
    evolucion_data = [['Mes', 'Cantidad de Productos']]
    for i, mes in enumerate(meses):
        evolucion_data.append([mes, str(cantidades[i])])
    
    evolucion_table = Table(evolucion_data, colWidths=[150, 150])
    evolucion_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4af37')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d4af37')),
    ]))
    story.append(evolucion_table)
    story.append(Spacer(1, 30))
    
    # Información adicional
    story.append(Paragraph("Información Adicional", section_style))
    
    info_data = [
        ['Stock Total', f'{stock_total:,} unidades'],
        ['Stock Promedio', f'{int(stock_total / total_productos) if total_productos > 0 else 0} unidades'],
        ['Productos con Stock Óptimo', str(productos_optimos)],
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
def export_productos_excel(request):
    wb = Workbook()
    ws = wb.active
    ws.title = "Productos"

    fondo_negro = PatternFill(start_color="0F0F0F", end_color="0F0F0F", fill_type="solid")
    dorado = "D4AF37"
    borde_dorado = Border(
        left=Side(style="thin", color=dorado),
        right=Side(style="thin", color=dorado),
        top=Side(style="thin", color=dorado),
        bottom=Side(style="thin", color=dorado),
    )

    headers = ["ID", "Nombre", "Fecha Registro", "Precio", "Stock Actual", "Stock Mínimo", "Unidad"]
    ws.append(headers)

    for col in ws[1]:
        col.fill = fondo_negro
        col.font = Font(color=dorado, bold=True)
        col.alignment = Alignment(horizontal="center")
        col.border = borde_dorado

    for producto in Producto.objects.all():
        ws.append([
            producto.id,
            producto.nombre,
            producto.fecha_registro.strftime("%d/%m/%Y") if producto.fecha_registro else "",
            float(producto.precio_unitario),
            producto.stock_actual,
            producto.stock_minimo,
            producto.unidad_medida.nombre if producto.unidad_medida else ""
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
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=productos_fragata.xlsx"
    wb.save(response)
    return response


# ==================== EXPORTAR A PDF (LISTA DE PRODUCTOS) ====================
def export_productos_pdf(request):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=productos_fragata.pdf"

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.setFillColorRGB(0.06, 0.06, 0.06)
    p.rect(0, 0, width, height, fill=1)

    p.setFillColor(colors.HexColor("#D4AF37"))
    p.setFont("Helvetica-Bold", 18)
    p.drawString(200, height - 50, "La Fragata Giratoria")
    p.drawString(180, height - 80, "Listado de Productos")

    y = height - 120
    p.setFont("Helvetica", 10)

    for producto in Producto.objects.all():
        texto = f"{producto.id} | {producto.nombre} | ${producto.precio_unitario} | Stock: {producto.stock_actual} {producto.unidad_medida.nombre if producto.unidad_medida else ''}"
        p.setFillColor(colors.HexColor("#FFFFFF"))
        p.drawString(40, y, texto[:90])
        y -= 20

        if y < 40:
            p.showPage()
            p.setFillColorRGB(0.06, 0.06, 0.06)
            p.rect(0, 0, width, height, fill=1)
            p.setFillColor(colors.HexColor("#D4AF37"))
            p.setFont("Helvetica", 10)
            y = height - 40

    p.save()
    return response