import io
from datetime import datetime, date

from django.views.generic import ListView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import F, Sum, Avg, Count
from django.http import HttpResponse
from django.contrib import messages
from django.views import View
from .forms import ProductoForm

# ReportLab
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

# Excel
from openpyxl import Workbook
import json
from django.http import JsonResponse

# Modelos
from .models import Producto, UnidadMedida


# ==================== CRUD ====================

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


# Vista de crear producto (funcional con tu HTML)
def crear_producto(request):
    """Vista para crear un nuevo producto"""
    unidades = UnidadMedida.objects.all().order_by('nombre')
    
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        # Capturamos la fecha directamente desde el sistema al enviar el formulario
        fecha_registro = date.today().isoformat() 
        precio_unitario = request.POST.get('precio_unitario', '')
        stock_actual = request.POST.get('stock_actual', 0)
        stock_minimo = request.POST.get('stock_minimo', 0)
        unidad_medida_id = request.POST.get('unidad_medida', '')

        errores = []
        if not nombre:
            errores.append('El nombre es obligatorio')
        if not unidad_medida_id:
            errores.append('Debes seleccionar una unidad de medida')
        try:
            if precio_unitario and float(precio_unitario) <= 0:
                errores.append('El precio debe ser mayor a 0')
        except ValueError:
            errores.append('Precio inválido')
        
        if errores:
            for error in errores:
                messages.error(request, f'❌ {error}')
        else:
            try:
                producto = Producto.objects.create(
                    nombre=nombre,
                    fecha_registro=fecha_registro,
                    precio_unitario=precio_unitario,
                    stock_actual=stock_actual,
                    stock_minimo=stock_minimo,
                    unidad_medida_id=unidad_medida_id
                )
                messages.success(request, f'✅ Producto "{nombre}" creado exitosamente')
                return redirect('productos:lista')
            except Exception as e:
                messages.error(request, f'❌ Error al crear producto: {str(e)}')
    
    if not unidades.exists():
        messages.warning(
            request,
            'No hay unidades de medida. Ejecuta: python manage.py cargar_unidades_medida',
        )

    context = {
        'unidades': unidades,
        'hoy': date.today().strftime('%d/%m/%Y'),
    }
    return render(request, 'roles/admin/Crud/productos/crear.html', context)


class ProductoUpdateView(UpdateView):
    model = Producto
    form_class = ProductoForm  # Usamos el formulario donde ya excluimos 'fecha_registro'
    template_name = "roles/admin/Crud/productos/editar.html"
    success_url = reverse_lazy("productos:lista")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['unidades'] = UnidadMedida.objects.all().order_by('nombre')
        return context

    def form_valid(self, form):
        producto = form.save(commit=False)
        
        # Validación de nombre (puedes dejarla aquí o moverla al formulario)
        if producto.nombre and not all(c.isalpha() or c.isspace() for c in producto.nombre):
            messages.error(self.request, '❌ El nombre solo debe contener letras y espacios')
            return self.form_invalid(form)
        
        # Validación de precio
        if producto.precio_unitario and producto.precio_unitario <= 0:
            messages.error(self.request, '❌ El precio debe ser mayor a 0')
            return self.form_invalid(form)
        
        producto.save()
        messages.success(self.request, f'✅ Producto "{producto.nombre}" actualizado exitosamente')
        return super().form_valid(form)


class ProductoDeleteView(DeleteView):
    model = Producto
    template_name = "roles/admin/Crud/productos/eliminar.html"
    success_url = reverse_lazy("productos:lista")

    def delete(self, request, *args, **kwargs):
        producto = self.get_object()
        nombre = producto.nombre
        messages.success(request, f'✅ Producto "{nombre}" eliminado exitosamente', extra_tags='delete')
        return super().delete(request, *args, **kwargs)


def detalle_producto(request, pk):
    producto = get_object_or_404(Producto, id=pk)
    return render(request, 'roles/admin/Crud/productos/detalle_producto.html', {'producto': producto})


# ==================== ESTADÍSTICAS ====================

def estadisticas_productos(request):
    productos = Producto.objects.all()

    total_productos = productos.count()
    valor_inventario = sum(p.precio_unitario * p.stock_actual for p in productos)
    stock_total = productos.aggregate(Sum('stock_actual'))['stock_actual__sum'] or 0
    precio_promedio = productos.aggregate(Avg('precio_unitario'))['precio_unitario__avg'] or 0
    productos_bajo_stock = productos.filter(stock_actual__lte=5).count()

    context = {
        'total_productos': total_productos,
        'valor_inventario': valor_inventario,
        'stock_total': stock_total,
        'precio_promedio': precio_promedio,
        'productos_bajo_stock': productos_bajo_stock,
        'ultima_actualizacion': datetime.now(),
    }

    return render(request, 'roles/admin/Crud/productos/estadisticas_productos.html', context)


# ==================== EXPORTACIONES ====================

def export_productos_excel(request):
    productos = Producto.objects.all()

    wb = Workbook()
    ws = wb.active
    ws.title = "Inventario"

    headers = ["ID", "Nombre", "Precio", "Stock Actual", "Stock Mínimo", "Unidad", "Fecha Registro"]
    ws.append(headers)

    for p in productos:
        ws.append([
            p.id, 
            p.nombre, 
            float(p.precio_unitario), 
            p.stock_actual,
            p.stock_minimo,
            p.unidad_medida.nombre if p.unidad_medida else "",
            p.fecha_registro.strftime('%d/%m/%Y') if p.fecha_registro else ""
        ])

    response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response["Content-Disposition"] = 'attachment; filename="productos.xlsx"'
    wb.save(response)

    return response


def export_productos_pdf(request):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="productos.pdf"'

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFillColor(colors.HexColor("#D4AF37"))
    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width/2, height - 50, "LA FRAGATA GIRATORIA")
    
    p.setFillColor(colors.white)
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 110, f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}")

    y = height - 160
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y, "ID")
    p.drawString(100, y, "Nombre")
    p.drawString(300, y, "Precio")
    p.drawString(400, y, "Stock")
    y -= 20

    p.setFont("Helvetica", 9)
    for prod in Producto.objects.all()[:30]:
        p.drawString(50, y, str(prod.id))
        p.drawString(100, y, prod.nombre[:30])
        p.drawString(300, y, f"${prod.precio_unitario}")
        p.drawString(400, y, str(prod.stock_actual))
        y -= 15
        if y < 50:
            p.showPage()
            y = height - 50

    p.save()
    response.write(buffer.getvalue())
    buffer.close()

    return response


def export_estadisticas_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="estadisticas_productos.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    styles = getSampleStyleSheet()
    elementos = []

    productos = Producto.objects.all()
    total_productos = productos.count()
    stock_total = productos.aggregate(Sum('stock_actual'))['stock_actual__sum'] or 0
    precio_promedio = productos.aggregate(Avg('precio_unitario'))['precio_unitario__avg'] or 0
    valor_inventario = sum(p.precio_unitario * p.stock_actual for p in productos)

    elementos.append(Paragraph("LA FRAGATA GIRATORIA", styles['Title']))
    elementos.append(Spacer(1, 10))
    elementos.append(Paragraph("Reporte de Estadísticas de Productos", styles['Heading2']))
    elementos.append(Spacer(1, 20))

    data = [
        ["Métrica", "Valor"],
        ["Total Productos", str(total_productos)],
        ["Stock Total", str(stock_total)],
        ["Valor Inventario", f"${valor_inventario:,.0f}"],
        ["Precio Promedio", f"${precio_promedio:,.0f}"],
    ]

    tabla = Table(data, colWidths=[200, 200])
    tabla.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#D4AF37")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))

    elementos.append(tabla)
    doc.build(elementos)

    return response


def exportar_seleccionados(request):
    if request.method == "POST":
        ids = request.POST.getlist('ids')
        productos = Producto.objects.filter(id__in=ids)
    else:
        productos = Producto.objects.all()

    wb = Workbook()
    ws = wb.active
    ws.title = "Inventario"

    headers = ["ID", "Nombre", "Precio", "Stock", "Unidad"]
    ws.append(headers)

    for p in productos:
        ws.append([
            p.id, 
            p.nombre, 
            float(p.precio_unitario), 
            p.stock_actual,
            p.unidad_medida.nombre if p.unidad_medida else ""
        ])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = 'attachment; filename="productos_seleccionados.xlsx"'

    wb.save(response)
    return response


def eliminar_multiple_productos(request):
    """Eliminar múltiples productos vía POST JSON o form.
    Retorna JSON con {'success': True, 'deleted_count': n} para integración con fetch.
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

    # Intentar parsear JSON desde body
    ids = []
    try:
        payload = json.loads(request.body.decode('utf-8') or '{}')
        ids = payload.get('ids') or []
    except Exception:
        ids = []

    # Fallback a campos de formulario
    if not ids:
        ids = request.POST.getlist('ids') or request.POST.get('delete_ids', '')

    if isinstance(ids, str):
        ids = [i for i in ids.split(',') if i.strip()]

    if not ids:
        return JsonResponse({'success': False, 'error': 'No se recibieron IDs'}, status=400)

    productos_qs = Producto.objects.filter(id__in=ids)
    deleted_count = productos_qs.count()
    productos_qs.delete()

    return JsonResponse({'success': True, 'deleted_count': deleted_count})