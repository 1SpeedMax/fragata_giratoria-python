release: python manage.py migrate --noinput && python manage.py cargar_platillos --actualizar-imagenes
web: gunicorn fragata.wsgi --bind 0.0.0.0:${PORT:-8000}
