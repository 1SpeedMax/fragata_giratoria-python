from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import F, Sum, Q  # <-- Agregar Sum
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.contrib import messages

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from .models import Producto, UnidadMedida  # <-- Corregido, quitar contacto


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


class ProductoDeleteView(DeleteView):
    model = Producto
    template_name = "roles/admin/Crud/productos/eliminar.html"
    success_url = reverse_lazy("productos:lista")
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "✅ Producto eliminado exitosamente")
        return super().delete(request, *args, **kwargs)
    
    
# ==================== ESTADÍSTICAS DE PRODUCTOS ====================
def estadisticas_productos(request):
    """Vista de estadísticas de productos"""
    from django.db.models import F, Sum, Value
    from django.db.models.functions import Coalesce
    from datetime import datetime, timedelta
    import calendar
    
    productos = Producto.objects.all()
    
    # Calcular estadísticas
    total_productos = productos.count()
    
    # Calcular valor del inventario (precio * stock)
    valor_inventario = 0
    for p in productos:
        valor_inventario += p.precio_unitario * p.stock_actual
    
    productos_bajo_stock = productos.filter(
        stock_actual__lte=F("stock_minimo")
    ).count()
    
    # Productos por categoría (simulado)
    categorias = ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']
    valores_categorias = [40, 30, 15, 10, 5]  # Ejemplo, puedes calcular según tus datos
    
    # Datos para gráfico de evolución (últimos 6 meses)
    meses = []
    cantidades = []
    
    for i in range(5, -1, -1):
        fecha = datetime.now() - timedelta(days=30*i)
        mes_nombre = calendar.month_abbr[fecha.month]
        meses.append(mes_nombre)
        
        # Datos de ejemplo - puedes ajustar según fecha_registro
        cantidades.append(total_productos // 6 * (i + 1) or 1)
    
    context = {
        'total_productos': total_productos,
        'totalProductos': total_productos,  # Para compatibilidad
        'valor_inventario': valor_inventario,
        'productos_bajo_stock': productos_bajo_stock,
        'productosBajoStock': productos_bajo_stock,  # Para compatibilidad
        'categorias': categorias,
        'valores_categorias': valores_categorias,
        'meses': meses,
        'cantidades': cantidades,
    }
    
    return render(request, 'roles/admin/Crud/productos/estadisticas_productos.html', context)


# ✅ EXPORTAR A EXCEL
def export_productos_excel(request):
    wb = Workbook()
    ws = wb.active
    ws.title = "Productos"

    # 🎨 Colores
    fondo_negro = PatternFill(start_color="0F0F0F", end_color="0F0F0F", fill_type="solid")
    dorado = "D4AF37"
    borde_dorado = Border(
        left=Side(style="thin", color=dorado),
        right=Side(style="thin", color=dorado),
        top=Side(style="thin", color=dorado),
        bottom=Side(style="thin", color=dorado),
    )

    # Encabezados
    headers = ["ID", "Nombre", "Fecha Registro", "Precio", "Stock Actual", "Stock Mínimo", "Unidad"]
    ws.append(headers)

    for col in ws[1]:
        col.fill = fondo_negro
        col.font = Font(color=dorado, bold=True)
        col.alignment = Alignment(horizontal="center")
        col.border = borde_dorado

    # Datos
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

    # Estilo filas
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


# ✅ EXPORTAR A PDF
def export_productos_pdf(request):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=productos_fragata.pdf"

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    # Fondo negro
    p.setFillColorRGB(0.06, 0.06, 0.06)
    p.rect(0, 0, width, height, fill=1)

    # Título dorado
    p.setFillColor(colors.HexColor("#D4AF37"))
    p.setFont("Helvetica-Bold", 18)
    p.drawString(200, height - 50, "La Fragata Giratoria")
    p.drawString(180, height - 80, "Listado de Productos")

    y = height - 120
    p.setFont("Helvetica", 10)

    for producto in Producto.objects.all():
        texto = f"{producto.id} | {producto.nombre} | ${producto.precio_unitario} | Stock: {producto.stock_actual} {producto.unidad_medida.nombre if producto.unidad_medida else ''}"
        p.setFillColor(colors.HexColor("#FFFFFF"))
        p.drawString(40, y, texto[:90])  # Limitar longitud
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

from django.shortcuts import get_object_or_404, render

def detalle_producto(request, pk):
    """Vista para ver el detalle de un producto"""
    producto = get_object_or_404(Producto, id=pk)
    return render(request, 'roles/admin/Crud/productos/detalle_producto.html', {'producto': producto})