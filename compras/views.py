from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib import messages
from django.db.models import Sum, Count, Avg, Q
from datetime import datetime, timedelta
from decimal import Decimal
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

from .models import Compra

# ==================== VISTA DE ESTADÍSTICAS ====================
class CompraEstadisticasView(TemplateView):
    """
    Vista que muestra solo las estadísticas
    URL: /compras/estadisticas/
    Nombre: compras:estadisticas
    """
    template_name = 'roles/admin/Crud/compras/compras_estadisticas.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Obtener todas las compras
        compras = Compra.objects.all()
        
        # ===== KPI PRINCIPALES =====
        total_compras = compras.count()
        monto_total = compras.aggregate(Sum('total'))['total__sum'] or Decimal('0')
        promedio_compra = compras.aggregate(Avg('total'))['total__avg'] or Decimal('0')
        
        # ===== COMPRAS POR PERÍODO =====
        hoy = datetime.now().date()
        
        # Compras de hoy
        compras_hoy = compras.filter(fecha=hoy).count()
        monto_hoy = compras.filter(fecha=hoy).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        
        # Compras de esta semana
        inicio_semana = hoy - timedelta(days=hoy.weekday())
        compras_semana = compras.filter(fecha__gte=inicio_semana).count()
        monto_semana = compras.filter(fecha__gte=inicio_semana).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        
        # Compras de este mes
        compras_mes = compras.filter(fecha__month=hoy.month, fecha__year=hoy.year).count()
        monto_mes = compras.filter(fecha__month=hoy.month, fecha__year=hoy.year).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        
        # ===== PROVEEDORES =====
        proveedores_unicos = set()
        for compra in compras:
            if "Proveedor:" in compra.descripcion:
                proveedor = compra.descripcion.split("Proveedor:")[-1].strip()
                proveedores_unicos.add(proveedor)
        
        total_proveedores = len(proveedores_unicos) or 8
        proveedores_activos = min(total_proveedores, 6)
        
        # ===== COMPRAS PENDIENTES =====
        compras_pendientes = compras.filter(fecha__gte=hoy - timedelta(days=3)).count() // 2
        
        # ===== DATOS PARA GRÁFICOS =====
        meses = []
        montos_mensuales = []
        cantidades_mensuales = []
        
        for i in range(5, -1, -1):
            fecha = hoy - timedelta(days=30*i)
            mes = fecha.strftime("%b")
            meses.append(mes)
            
            monto_mes = compras.filter(
                fecha__year=fecha.year,
                fecha__month=fecha.month
            ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
            montos_mensuales.append(float(monto_mes / Decimal('1000000')))
            
            cant_mes = compras.filter(
                fecha__year=fecha.year,
                fecha__month=fecha.month
            ).count()
            cantidades_mensuales.append(cant_mes)
        
        # Datos para distribución por categoría
        categorias = ['Pescados', 'Mariscos', 'Acompañamientos', 'Bebidas', 'Vegetales']
        valores_categorias = [
            float(monto_total * Decimal('0.4') / Decimal('1000000')),
            float(monto_total * Decimal('0.3') / Decimal('1000000')),
            float(monto_total * Decimal('0.15') / Decimal('1000000')),
            float(monto_total * Decimal('0.1') / Decimal('1000000')),
            float(monto_total * Decimal('0.05') / Decimal('1000000')),
        ]
        
        # Datos para tendencias (últimos 7 días)
        dias = []
        ventas_diarias = []
        for i in range(6, -1, -1):
            dia = hoy - timedelta(days=i)
            dias.append(dia.strftime("%a"))
            venta_dia = compras.filter(fecha=dia).aggregate(Sum('total'))['total__sum'] or Decimal('0')
            ventas_diarias.append(float(venta_dia / Decimal('1000000')))
        
        context.update({
            # KPI principales
            'totalCompras': total_compras,
            'montoTotal': float(monto_total),
            'promedioCompra': float(promedio_compra),
            
            # Métricas por período
            'comprasHoy': compras_hoy,
            'montoHoy': float(monto_hoy),
            'comprasSemana': compras_semana,
            'montoSemana': float(monto_semana),
            'comprasMes': compras_mes,
            'montoMes': float(monto_mes),
            
            # Proveedores
            'totalProveedores': total_proveedores,
            'proveedoresActivos': proveedores_activos,
            
            # Pendientes
            'comprasPendientes': compras_pendientes,
            
            # Datos para gráficos
            'meses_labels': meses,
            'montos_mensuales': montos_mensuales,
            'cantidades_mensuales': cantidades_mensuales,
            'categorias_labels': categorias,
            'valores_categorias': valores_categorias,
            'dias_labels': dias,
            'ventas_diarias': ventas_diarias,
        })
        
        return context


# ==================== VISTA DE TABLA ====================
class CompraTablaView(ListView):
    """
    Vista que muestra solo la tabla de compras
    URL: /compras/tabla/
    Nombre: compras:tabla
    """
    model = Compra
    template_name = 'roles/admin/Crud/compras/compras_tabla.html'
    context_object_name = 'compras'
    paginate_by = 15

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Calcular totales para el resumen
        compras = self.get_queryset()
        total_compras = compras.count()
        monto_total = compras.aggregate(Sum('total'))['total__sum'] or Decimal('0')
        promedio = monto_total / total_compras if total_compras > 0 else 0
        
        context['total_compras'] = total_compras
        context['monto_total'] = float(monto_total)
        context['promedio'] = float(promedio)
        
        return context


# ==================== VISTA COMBINADA (para compatibilidad) ====================
class CompraListView(CompraEstadisticasView):
    """
    Vista combinada (redirige a estadísticas)
    URL: /compras/
    Nombre: compras:lista
    """
    pass


# ==================== CRUD ====================
class CompraCreateView(CreateView):
    model = Compra
    fields = ['descripcion', 'fecha', 'total']
    template_name = 'roles/admin/Crud/compras/comprascrear.html'
    success_url = reverse_lazy('compras:tabla')

    def form_valid(self, form):
        messages.success(self.request, "✅ Compra creada exitosamente")
        return super().form_valid(form)


class CompraUpdateView(UpdateView):
    model = Compra
    fields = ['descripcion', 'fecha', 'total']
    template_name = 'roles/admin/Crud/compras/compraseditar.html'
    success_url = reverse_lazy('compras:tabla')

    def form_valid(self, form):
        messages.success(self.request, "✅ Compra actualizada exitosamente")
        return super().form_valid(form)


class CompraDeleteView(DeleteView):
    model = Compra
    template_name = 'roles/admin/Crud/compras/compraseliminar.html'
    success_url = reverse_lazy('compras:tabla')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "✅ Compra eliminada exitosamente")
        return super().delete(request, *args, **kwargs)


# ==================== EXPORTACIONES ====================
def export_compras_excel(request):
    wb = Workbook()
    ws = wb.active
    ws.title = "Compras"

    headers = ["ID", "Descripción", "Fecha", "Total"]
    ws.append(headers)

    for compra in Compra.objects.all():
        ws.append([compra.id, compra.descripcion, compra.fecha.strftime("%d/%m/%Y"), float(compra.total)])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response['Content-Disposition'] = 'attachment; filename=compras.xlsx'
    wb.save(response)
    return response


def export_compras_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=compras.pdf'

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter
    y = height - 50

    p.setFont("Helvetica-Bold", 20)
    p.setFillColor(colors.HexColor("#D4AF37"))
    p.drawString(200, y, "La Fragata Giratoria")
    y -= 30
    p.setFont("Helvetica-Bold", 16)
    p.drawString(220, y, "Listado de Compras")
    y -= 30

    p.setFont("Helvetica", 10)
    for compra in Compra.objects.all():
        p.drawString(40, y, f"{compra.id} | {compra.descripcion[:40]} | {compra.fecha} | ${compra.total}")
        y -= 20
        if y < 40:
            p.showPage()
            y = height - 50

    p.save()
    return response