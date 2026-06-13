from .models import RegistroActividad

def actividad_reciente(request):
    return {
        'actividades_recientes': RegistroActividad.objects.all()[:5]
    }