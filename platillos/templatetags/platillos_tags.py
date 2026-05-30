from django import template
from django.templatetags.static import static

register = template.Library()


@register.simple_tag
def platillo_imagen(platillo):
    url = (platillo.imagen_url or '').strip()
    if url.startswith(('http://', 'https://')):
        return url
    path = platillo.get_imagen_static_path()
    if path:
        return static(path)
    return static('img/icono-fragata.jpg')
