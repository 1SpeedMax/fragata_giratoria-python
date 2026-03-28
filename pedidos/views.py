from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.utils import timezone
from django.db.models import Sum, Q
from django.contrib.auth import get_user_model
from django.http import HttpResponse
import json
from datetime import date

# Importaciones correctas
from .models import Pedido, PedidoItem, Cliente
from platillos.models import Platillo
from metodos_pago.models import MetodoPago

User = get_user_model()

def lista_pedidos(request):
    """Vista para listar todos los pedidos"""
    pedidos = Pedido.objects.all().select_related('id_cliente', 'id_usuario', 'id_metodo_pago').prefetch_related('items')
    
    # Calcular estadísticas
    total_pedidos = Pedido.objects.count()
    
    # Monto pendiente (pedidos que no están completados o cancelados)
    monto_pendiente = Pedido.objects.filter(
        ~Q(estado__in=['ENTREGADO', 'CANCELADO'])
    ).aggregate(total=Sum('total'))['total'] or 0
    
    # Pedidos de hoy
    hoy = date.today()
    pedidos_hoy = Pedido.objects.filter(fecha=hoy).count()
    
    context = {
        'pedidos': pedidos,
        'total_pedidos': total_pedidos,
        'monto_pendiente': monto_pendiente,
        'pedidos_hoy': pedidos_hoy,
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos.html', context)


def detalle_pedido(request, id_pedido):
    """Vista para ver detalles de un pedido"""
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    items = PedidoItem.objects.filter(pedido=pedido)
    
    context = {
        'pedido': pedido,
        'items': items,
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos_detalle.html', context)


def crear_pedido(request):
    """Vista para crear un nuevo pedido"""
    if request.method == 'POST':
        # Crear nuevo pedido
        pedido = Pedido.objects.create(
            fecha=request.POST.get('fecha'),
            estado='PENDIENTE',
            observaciones=request.POST.get('observaciones', '')
        )
        
        # Procesar cliente
        cliente_id = request.POST.get('id_cliente')
        if cliente_id:
            try:
                pedido.id_cliente = Cliente.objects.get(id_cliente=cliente_id)
            except Cliente.DoesNotExist:
                pass
        
        # Procesar usuario
        usuario_id = request.POST.get('id_usuario')
        if usuario_id:
            try:
                pedido.id_usuario = User.objects.get(id=usuario_id)
            except User.DoesNotExist:
                pass
        
        # Procesar método de pago
        metodo_id = request.POST.get('id_metodo_pago')
        if metodo_id:
            try:
                pedido.id_metodo_pago = MetodoPago.objects.get(id_metodo_pago=metodo_id)
            except MetodoPago.DoesNotExist:
                pass
        
        # Procesar items
        items_json = request.POST.get('items')
        if items_json:
            try:
                items_data = json.loads(items_json)
                total_pedido = 0
                
                for item_data in items_data:
                    platillo = None
                    if item_data.get('platillo_id'):
                        try:
                            platillo = Platillo.objects.get(id=item_data['platillo_id'])
                        except Platillo.DoesNotExist:
                            pass
                    
                    item = PedidoItem.objects.create(
                        pedido=pedido,
                        platillo=platillo,
                        nombre_platillo=item_data['nombre'],
                        cantidad=item_data['cantidad'],
                        precio_unitario=item_data['precio_unitario'],
                        subtotal=item_data['subtotal']
                    )
                    total_pedido += float(item.subtotal)
                
                pedido.total = total_pedido
                
                # Campos legacy
                if items_data:
                    primer_item = items_data[0]
                    pedido.nombre_platillo = primer_item['nombre']
                    pedido.precio_unitario = primer_item['precio_unitario']
                    pedido.subtotal = primer_item['subtotal']
                    pedido.cantidad = primer_item['cantidad']
                
                pedido.save()
                
            except json.JSONDecodeError:
                messages.error(request, 'Error al procesar los items')
                pedido.delete()
                return redirect('pedidos:nuevo')
        
        messages.success(request, 'Pedido creado exitosamente')
        return redirect('pedidos:lista')
    
    # GET - Mostrar formulario
    platillos = Platillo.objects.filter(disponible=True)
    platillos_json = json.dumps([
        {
            'id': p.id,
            'nombre': p.nombre,
            'emojis': p.emojis or '🍽️',
            'precio': float(p.precio)
        } for p in platillos
    ])
    
    context = {
        'platillos_json': platillos_json,
        'clientes': Cliente.objects.all(),
        'usuarios': User.objects.all(),
        'metodos_pago': MetodoPago.objects.all(),
        'hoy': date.today(),
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos_crear.html', context)


def editar_pedido(request, id_pedido):
    """Vista para editar un pedido existente"""
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    
    if request.method == 'POST':
        # Actualizar datos básicos del pedido
        pedido.fecha = request.POST.get('fecha')
        pedido.estado = request.POST.get('estado')
        pedido.observaciones = request.POST.get('observaciones', '')
        
        # Actualizar cliente
        cliente_id = request.POST.get('id_cliente')
        if cliente_id and cliente_id != '':
            try:
                pedido.id_cliente = Cliente.objects.get(id_cliente=cliente_id)
            except Cliente.DoesNotExist:
                pedido.id_cliente = None
        else:
            pedido.id_cliente = None
        
        # Actualizar usuario
        usuario_id = request.POST.get('id_usuario')
        if usuario_id and usuario_id != '':
            try:
                pedido.id_usuario = User.objects.get(id=usuario_id)
            except User.DoesNotExist:
                pedido.id_usuario = None
        else:
            pedido.id_usuario = None
        
        # Actualizar método de pago
        metodo_id = request.POST.get('id_metodo_pago')
        if metodo_id and metodo_id != '':
            try:
                pedido.id_metodo_pago = MetodoPago.objects.get(id_metodo_pago=metodo_id)
            except MetodoPago.DoesNotExist:
                pedido.id_metodo_pago = None
        else:
            pedido.id_metodo_pago = None
        
        pedido.save()
        
        # Procesar items
        items_json = request.POST.get('items')
        if items_json:
            try:
                items_data = json.loads(items_json)
                
                # Eliminar items existentes
                PedidoItem.objects.filter(pedido=pedido).delete()
                
                # Crear nuevos items
                total_pedido = 0
                for item_data in items_data:
                    platillo = None
                    if item_data.get('platillo_id'):
                        try:
                            platillo = Platillo.objects.get(id=item_data['platillo_id'])
                        except Platillo.DoesNotExist:
                            pass
                    
                    item = PedidoItem.objects.create(
                        pedido=pedido,
                        platillo=platillo,
                        nombre_platillo=item_data['nombre'],
                        cantidad=item_data['cantidad'],
                        precio_unitario=item_data['precio_unitario'],
                        subtotal=item_data['subtotal']
                    )
                    total_pedido += float(item.subtotal)
                
                pedido.total = total_pedido
                
                # Actualizar campos legacy para compatibilidad
                if items_data:
                    primer_item = items_data[0]
                    pedido.nombre_platillo = primer_item['nombre']
                    pedido.precio_unitario = primer_item['precio_unitario']
                    pedido.subtotal = primer_item['subtotal']
                    pedido.cantidad = primer_item['cantidad']
                
                pedido.save()
                
            except json.JSONDecodeError:
                messages.error(request, 'Error al procesar los items del pedido')
                return redirect('pedidos:editar', id_pedido=id_pedido)
        
        messages.success(request, 'Pedido actualizado exitosamente')
        return redirect('pedidos:lista')
    
    # GET - Mostrar formulario de edición
    platillos = Platillo.objects.filter(disponible=True)
    platillos_json = json.dumps([
        {
            'id': p.id,
            'nombre': p.nombre,
            'emojis': p.emojis or '🍽️',
            'precio': float(p.precio)
        } for p in platillos
    ])
    
    # Obtener items del pedido
    items = PedidoItem.objects.filter(pedido=pedido)
    items_json = json.dumps([
        {
            'id': item.id_item,
            'platillo_id': item.platillo.id if item.platillo else None,
            'nombre_platillo': item.nombre_platillo,
            'cantidad': item.cantidad,
            'precio_unitario': float(item.precio_unitario),
            'subtotal': float(item.subtotal)
        } for item in items
    ])
    
    context = {
        'pedido': pedido,
        'items_json': items_json,
        'platillos_json': platillos_json,
        'clientes': Cliente.objects.all(),
        'usuarios': User.objects.all(),
        'metodos_pago': MetodoPago.objects.all(),
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos_editar.html', context)


def eliminar_pedido(request, id_pedido):
    """Vista para eliminar un pedido"""
    pedido = get_object_or_404(Pedido, id_pedido=id_pedido)
    
    if request.method == 'POST':
        # Eliminar items primero
        PedidoItem.objects.filter(pedido=pedido).delete()
        # Eliminar pedido
        pedido.delete()
        messages.success(request, 'Pedido eliminado exitosamente')
        return redirect('pedidos:lista')
    
    context = {
        'pedido': pedido,
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos_eliminar.html', context)


def estadisticas_pedidos(request):
    """Vista para estadísticas de pedidos"""
    # Estadísticas por estado
    estados = {
        'PENDIENTE': Pedido.objects.filter(estado='PENDIENTE').count(),
        'ENVIADO': Pedido.objects.filter(estado='ENVIADO').count(),
        'ENTREGADO': Pedido.objects.filter(estado='ENTREGADO').count(),
        'CANCELADO': Pedido.objects.filter(estado='CANCELADO').count(),
    }
    
    # Total de ventas
    total_ventas = Pedido.objects.filter(estado='ENTREGADO').aggregate(total=Sum('total'))['total'] or 0
    
    # Pedidos por mes
    from django.db.models.functions import TruncMonth
    pedidos_por_mes = Pedido.objects.annotate(
        mes=TruncMonth('fecha')
    ).values('mes').annotate(
        total=Count('id_pedido'),
        ventas=Sum('total')
    ).order_by('-mes')
    
    context = {
        'estados': estados,
        'total_ventas': total_ventas,
        'pedidos_por_mes': pedidos_por_mes,
    }
    
    return render(request, 'roles/admin/Crud/pedidos/pedidos_estadisticas.html', context)


def exportar_excel(request):
    """Exportar pedidos a Excel"""
    # Implementar exportación a Excel
    messages.info(request, 'Funcionalidad de exportación a Excel en desarrollo')
    return redirect('pedidos:lista')


def exportar_pdf(request):
    """Exportar pedidos a PDF"""
    # Implementar exportación a PDF
    messages.info(request, 'Funcionalidad de exportación a PDF en desarrollo')
    return redirect('pedidos:lista')