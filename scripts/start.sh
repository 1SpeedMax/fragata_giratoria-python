#!/bin/sh
set -e

echo "==> Migraciones..."
python manage.py migrate --noinput

echo "==> Cargando categorías y platillos del menú..."
python manage.py cargar_platillos --actualizar-imagenes

echo "==> Cargando unidades de medida..."
python manage.py cargar_unidades_medida

echo "==> Iniciando Gunicorn..."
exec gunicorn fragata.wsgi --bind "0.0.0.0:${PORT:-8000}"
