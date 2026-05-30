from django.conf import settings


class DynamicCsrfTrustedOriginMiddleware:
    """Registra el dominio actual en CSRF_TRUSTED_ORIGINS (necesario en Railway)."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()
        if host:
            scheme = 'https' if request.is_secure() else 'http'
            origin = f'{scheme}://{host}'
            if origin not in settings.CSRF_TRUSTED_ORIGINS:
                settings.CSRF_TRUSTED_ORIGINS.append(origin)
        return self.get_response(request)
