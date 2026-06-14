from .models import ActivityLog

def recent_activities(request):
    if request.path.startswith('/admin'):
        recent = ActivityLog.objects.all()[:8]
        return {'recent_activities': recent}
    return {}