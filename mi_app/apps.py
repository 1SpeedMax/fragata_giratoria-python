from django.apps import AppConfig


class MiAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mi_app'

    def ready(self):
        # importar señales (archivo creado arriba)
        try:
            import mi_app.signals  # noqa
        except Exception:
            pass
