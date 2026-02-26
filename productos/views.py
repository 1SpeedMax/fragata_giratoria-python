from django.shortcuts import render
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.db import models
from .models import Producto

class ProductoListView(ListView):
    model = Producto
    template_name = "productos/lista.html"
    context_object_name = "productos"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["total_productos"] = Producto.objects.count()
        context["productos_bajo_stock"] = Producto.objects.filter(
            stock_actual__lte=models.F("stock_minimo")
        ).count()
        return context