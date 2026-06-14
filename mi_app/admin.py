from django.contrib import admin
from .models import ActivityLog
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'action', 'content_type', 'object_repr', 'user', 'ip')
    search_fields = ('object_repr', 'user__username', 'content_type__model')
    list_filter = ('action', 'content_type', 'user')
    actions = ['clear_activity_logs']

    def clear_activity_logs(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'Se eliminaron {count} entradas.', level=messages.SUCCESS)
    clear_activity_logs.short_description = 'Eliminar entradas seleccionadas'

# Vista admin para eliminar todo (botón desde sidebar)
def clear_all_activity(request):
    if not request.user.is_staff:
        return redirect('admin:index')
    ActivityLog.objects.all().delete()
    messages.success(request, 'Se eliminaron todas las entradas de Actividad.')
    return redirect('admin:index')

# Añadimos la ruta al admin
def get_admin_urls(urls):
    def wrapper():
        my_urls = [
            path('clear-activity/', admin.site.admin_view(clear_all_activity), name='clear_activity'),
        ]
        return my_urls + urls()
    return wrapper

admin.site.get_urls = get_admin_urls(admin.site.get_urls)
