from django.shortcuts import render
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from productos.models import Producto
from pedidos.models import Pedido
from compras.models import Compra
from usuarios.models import Usuario
from metodos_pago.models import MetodoPago

#Vista protegida
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render

#Definir admin para la protección de vitas
def es_admin(user):
    return user.is_staff


@login_required
@user_passes_test(es_admin)
def dashboard(request):
    """Vista principal del dashboard"""
    
    # ===== ESTADÍSTICAS DE PRODUCTOS =====
    total_productos = Producto.objects.count()
    
    # Productos con stock bajo (stock_actual menor que stock_minimo)
    productos_bajo_stock = Producto.objects.filter(
        stock_actual__lt=F('stock_minimo')
    ).order_by('stock_actual')[:5]
    
    # Calcular productos nuevos en la última semana
    una_semana_atras = datetime.now().date() - timedelta(days=7)
    productos_nuevos = Producto.objects.filter(
        fecha_registro__gte=una_semana_atras
    ).count()
    
    # ===== ESTADÍSTICAS DE PEDIDOS =====
    hoy = datetime.now().date()
    pedidos_hoy = Pedido.objects.filter(fecha=hoy).count()
    pedidos_pendientes = Pedido.objects.filter(estado__iexact='PENDIENTE').count()
    
    # ===== ESTADÍSTICAS DE COMPRAS =====
    # Compras del mes actual
    inicio_mes = hoy.replace(day=1)
    compras_mes_total = Compra.objects.filter(
        fecha__gte=inicio_mes
    ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
    
    # Compras del mes anterior para comparar
    if inicio_mes.month == 1:
        inicio_mes_anterior = hoy.replace(year=hoy.year - 1, month=12, day=1)
    else:
        inicio_mes_anterior = hoy.replace(month=inicio_mes.month - 1, day=1)
    
    compras_mes_anterior = Compra.objects.filter(
        fecha__gte=inicio_mes_anterior,
        fecha__lt=inicio_mes
    ).aggregate(Sum('total'))['total__sum'] or Decimal('0')
    
    # Calcular variación porcentual
    if compras_mes_anterior > 0:
        compras_variacion = ((float(compras_mes_total) - float(compras_mes_anterior)) / float(compras_mes_anterior)) * 100
    else:
        compras_variacion = 0
    
    # ===== ESTADÍSTICAS DE USUARIOS =====
    total_usuarios = Usuario.objects.count()
    
    # Usuarios nuevos en el último mes
    usuarios_nuevos = Usuario.objects.filter(
        fecha_creacion__gte=inicio_mes
    ).count()
    
    # ===== ACTIVIDADES RECIENTES =====
    actividades_recientes = []
    
    # Últimos pedidos
    ultimos_pedidos = Pedido.objects.all().order_by('-fecha')[:3]
    for pedido in ultimos_pedidos:
        actividades_recientes.append({
            'titulo': f'Nuevo pedido #{pedido.id_pedido}',
            'descripcion': f'{pedido.nombre_platillo} - ${pedido.total}',
            'icono': 'fa-check-circle',
            'color': 'verde',
            'fecha': pedido.fecha
        })
    
    # Últimos productos agregados
    ultimos_productos = Producto.objects.all().order_by('-fecha_registro')[:3]
    for producto in ultimos_productos:
        actividades_recientes.append({
            'titulo': f'Nuevo producto: {producto.nombre}',
            'descripcion': f'Stock: {producto.stock_actual} unidades',
            'icono': 'fa-box',
            'color': 'azul',
            'fecha': producto.fecha_registro
        })
    
    # Últimos usuarios registrados
    ultimos_usuarios = Usuario.objects.all().order_by('-fecha_creacion')[:3]
    for usuario in ultimos_usuarios:
        actividades_recientes.append({
            'titulo': f'Nuevo usuario: {usuario.nombre_usuario}',
            'descripcion': f'Rol: {usuario.rol.nombre_rol if usuario.rol else "Cliente"}',
            'icono': 'fa-user-plus',
            'color': 'amarillo',
            'fecha': usuario.fecha_creacion
        })
    
    # Ordenar actividades por fecha (más recientes primero)
    actividades_recientes.sort(key=lambda x: x.get('fecha', datetime.now()), reverse=True)
    actividades_recientes = actividades_recientes[:5]
    
    # ===== DATOS PARA GRÁFICO =====
    # Ventas de los últimos 7 días
    ventas_semana = []
    dias_semana = []
    
    for i in range(6, -1, -1):
        fecha = hoy - timedelta(days=i)
        dias_semana.append(fecha.strftime('%a'))
        ventas_dia = Pedido.objects.filter(fecha=fecha).aggregate(Sum('total'))['total__sum'] or Decimal('0')
        ventas_semana.append(float(ventas_dia) / 1000000)
    
    # Ventas del mes (semanas)
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
        'compras_mes': compras_mes_total,
        'compras_variacion': round(compras_variacion, 1),
        'total_usuarios': total_usuarios,
        'usuarios_nuevos': usuarios_nuevos,
        'actividades_recientes': actividades_recientes,
        'ventas_semana': ventas_semana,
        'dias_semana': dias_semana,
        'ventas_mes': ventas_mes,
    }
    
    return render(request, 'admin/dashboard.html', context)