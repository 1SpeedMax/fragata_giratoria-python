from django.contrib import admin
from .models import Rol, Usuario

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['id_rol', 'nombre_rol', 'descripcion']
    search_fields = ['nombre_rol', 'descripcion']
    ordering = ['nombre_rol']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    # Campos a mostrar en la lista
    list_display = [
        'id_usuario', 
        'nombre_usuario', 
        'email', 
        'get_estado_display', 
        'rol',
        'fecha_creacion'
    ]
    
    # Filtros laterales
    list_filter = ['estado', 'rol']
    
    # Campos de búsqueda
    search_fields = ['nombre_usuario', 'email']
    
    # Ordenamiento por defecto
    ordering = ['-fecha_creacion']
    
    # Campos de solo lectura
    readonly_fields = ['fecha_creacion', 'password_hash']
    
    # Organización de campos en el formulario de edición
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre_usuario', 'email')
        }),
        ('Seguridad', {
            'fields': ('password_hash',),
            'classes': ('wide',),
            'description': 'El hash de la contraseña se genera automáticamente'
        }),
        ('Estado y Rol', {
            'fields': ('estado', 'rol')
        }),
        ('Auditoría', {
            'fields': ('fecha_creacion',),
            'classes': ('collapse',)
        }),
    )
    
    # Campos para la creación de nuevos usuarios
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('nombre_usuario', 'email', 'estado', 'rol'),
        }),
    )
    
    # Permitir búsqueda en campos relacionados
    raw_id_fields = ['rol']
    
    # Cantidad de elementos por página
    list_per_page = 25
    
    def get_estado_display(self, obj):
        """Muestra el estado con colores"""
        estado = obj.get_estado_display()
        if obj.estado == 'ACTIVO':
            return f'✅ {estado}'
        elif obj.estado == 'INACTIVO':
            return f'❌ {estado}'
        elif obj.estado == 'SUSPENDIDO':
            return f'⚠️ {estado}'
        return estado
    get_estado_display.short_description = 'Estado'
    get_estado_display.admin_order_field = 'estado'