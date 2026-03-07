from django.contrib import admin
from .models import Producto, UnidadMedida

@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_unitario', 'stock_actual', 'stock_minimo', 'unidad_medida')
    list_filter = ('unidad_medida',)
    search_fields = ('nombre',)