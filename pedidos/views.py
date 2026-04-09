import io
from datetime import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.db.models import Sum, Avg, Count

# --- IMPORTACIÓN DE MODELOS ---
from .models import Pedido, PedidoItem, Cliente
from productos.models import Producto

# --- REPORTLAB PARA PDF ---
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# ==================== VISTAS DE PEDIDOS ====================

def lista_pedidos(request):
    pedidos = Pedido.objects.all().order_by('-fecha') 
    return render(request, 'roles/admin/Crud/pedidos/pedidos.html', {'pedidos': pedidos})

def crear_pedido(request):
    if request.method == 'POST':
        # Aquí procesarías el formulario más adelante
        messages.success(request, "✅ Pedido creado exitosamente")
        return redirect('pedidos:lista')
    
    productos = Producto.objects.all()
    clientes = Cliente.objects.all()
    
    # CAMBIO AQUÍ: Usamos el nombre real de tu archivo físico
    return render(request, 'roles/admin/Crud/pedidos/pedidos_crear.html', {
        'productos': productos,
        'clientes': clientes
    })

def detalle_pedido(request, id_pedido):
    # CAMBIO: Usamos 'id_pedido' en lugar de 'id'
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    return render(request, 'roles/admin/Crud/pedidos/pedidos_detalle.html', {'pedido': pedido})

def editar_pedido(request, id_pedido):
    # CAMBIO: También aquí para que funcione el formulario
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    if request.method == 'POST':
        messages.success(request, "✅ Pedido actualizado")
        return redirect('pedidos:lista')
    return render(request, 'roles/admin/Crud/pedidos/pedidos_editar.html', {'pedido': pedido})

def eliminar_pedido(request, id_pedido):
    # CAMBIO: Y aquí también
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    if request.method == 'POST':
        pedido.delete()
        messages.success(request, "🗑️ Pedido eliminado")
        return redirect('pedidos:lista')
    return render(request, 'roles/admin/Crud/pedidos/pedidos_eliminar.html', {'pedido': pedido})

# ==================== ESTADÍSTICAS (La que faltaba) ====================

def estadisticas_pedidos(request):
    """Calcula los datos para el reporte de pedidos"""
    pedidos = Pedido.objects.all()
    total_ventas = pedidos.aggregate(Sum('total'))['total__sum'] or 0
    promedio_pedido = pedidos.aggregate(Avg('total'))['total__avg'] or 0
    conteo_pedidos = pedidos.count()

    context = {
        'total_ventas': total_ventas,
        'promedio_pedido': promedio_pedido,
        'conteo_pedidos': conteo_pedidos,
        'fecha': datetime.now()
    }
    
    # CAMBIO AQUÍ: Debe coincidir con el nombre de tu archivo físico
    return render(request, 'roles/admin/Crud/pedidos/pedidos_estadisticas.html', context)

# ==================== EXPORTACIONES ====================

def exportar_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="pedidos_fragata.pdf"'
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, "Reporte de Pedidos - La Fragata Giratoria")
    p.save()
    response.write(buffer.getvalue())
    buffer.close()
    return response

def exportar_excel(request):
    return HttpResponse("Lógica de Excel para pedidos pendiente")