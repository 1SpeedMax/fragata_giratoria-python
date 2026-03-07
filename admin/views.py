from django.shortcuts import render
from productos.models import Producto
from django.db.models import F

def dashboard(request):
    context = {
        "total_productos": Producto.objects.count(),
        "productos_bajo_stock": Producto.objects.filter(
            stock_actual__lte=F('stock_minimo')
        ).count(),
    }
    return render(request, 'roles/admin/dashboard.html', context)