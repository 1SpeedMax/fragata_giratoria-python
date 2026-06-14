import json
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.db import ProgrammingError, OperationalError, DatabaseError

from .models import ActivityLog

# intentamos importar helpers del middleware; si faltan, usamos stubs
try:
    from .middleware import get_current_user, get_current_request
except Exception:
    def get_current_request(): return None
    def get_current_user(): return None

WATCH_APPS = ['usuarios', 'pedidos', 'productos', 'compras', 'platillos', 'metodos_pago']

def should_watch(instance):
    try:
        app_label = instance._meta.app_label
        if instance.__class__.__name__ == 'ActivityLog' or app_label == 'mi_app':
            return False
        return app_label in WATCH_APPS
    except Exception:
        return False

logger = logging.getLogger(__name__)

@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    if not should_watch(instance):
        return
    action = 'CREATE' if created else 'UPDATE'
    try:
        content_type = ContentType.objects.get_for_model(instance.__class__)
    except Exception:
        content_type = None
    req = get_current_request()
    user = get_current_user()
    ip = getattr(req, 'META', {}).get('REMOTE_ADDR', '') if req else ''
    url = getattr(req, 'path', '') if req else ''
    try:
        raw = model_to_dict(instance)
        changes = json.loads(json.dumps(raw, cls=DjangoJSONEncoder))
    except Exception:
        changes = None
    try:
        ActivityLog.objects.create(
            user=user if getattr(user, 'is_authenticated', False) else None,
            content_type=content_type,
            object_id=str(getattr(instance, 'pk', '')),
            object_repr=str(instance),
            action=action,
            changes=changes,
            ip=ip,
            url=url,
        )
    except (ProgrammingError, OperationalError, DatabaseError) as e:
        logger.warning('ActivityLog no creado (save): %s', e)
    except Exception as e:
        logger.exception('Error al crear ActivityLog (save): %s', e)


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if not should_watch(instance):
        return
    try:
        content_type = ContentType.objects.get_for_model(instance.__class__)
    except Exception:
        content_type = None
    req = get_current_request()
    user = get_current_user()
    ip = getattr(req, 'META', {}).get('REMOTE_ADDR', '') if req else ''
    url = getattr(req, 'path', '') if req else ''
    try:
        ActivityLog.objects.create(
            user=user if getattr(user, 'is_authenticated', False) else None,
            content_type=content_type,
            object_id=str(getattr(instance, 'pk', '')),
            object_repr=str(instance),
            action='DELETE',
            changes=None,
            ip=ip,
            url=url,
        )
    except (ProgrammingError, OperationalError, DatabaseError) as e:
        logger.warning('ActivityLog no creado (delete): %s', e)
    except Exception as e:
        logger.exception('Error al crear ActivityLog (delete): %s', e)