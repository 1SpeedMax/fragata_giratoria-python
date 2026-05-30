from django import template

register = template.Library()


@register.filter
def estado_css(value):
    """Convierte 'EN PROCESO' -> 'en_proceso' para clases CSS."""
    if not value:
        return 'pendiente'
    return value.lower().strip().replace(' ', '_')
