from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Rol, Usuario

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id_rol", "nombre_rol", "descripcion")
    search_fields = ("nombre_rol", "descripcion")
    ordering = ("nombre_rol",)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id_usuario", "nombre_usuario", "email", "rol", "estado_badge", "is_staff")
    list_filter = ("estado", "rol", "is_staff")
    search_fields = ("nombre_usuario", "email")
    ordering = ("nombre_usuario",)

    def estado_badge(self, obj):
        mapping = {
            'ACTIVO': 'badge-activo',
            'SUSPENDIDO': 'badge-suspendido',
            'INACTIVO': 'badge-inactivo',
        }
        cls = mapping.get(getattr(obj, 'estado', '').upper(), 'badge-default')
        label = dict(getattr(obj, 'ESTADO_CHOICES', [])).get(obj.estado, obj.estado or '')
        # fallback label
        if not label:
            label = obj.estado.title() if getattr(obj, 'estado', None) else ''
        return mark_safe(f'<span class="badge {cls}">{label}</span>')
    estado_badge.short_description = "Estado"