import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ======================
# SEGURIDAD
# ======================
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-temp-key")

DEBUG = False  # en producción

ALLOWED_HOSTS = ['*']

def _csrf_trusted_origins():
    """Orígenes exactos para HTTPS en Railway (Django no admite comodines)."""
    origins = []

    railway_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN", "").strip()
    if railway_domain:
        origins.append(f"https://{railway_domain}")

    for url in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(","):
        url = url.strip()
        if url:
            origins.append(url.rstrip("/"))

    origins.extend([
        "https://fragatagiratoriapython-production.up.railway.app",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ])

    seen = set()
    unique = []
    for o in origins:
        if o not in seen:
            seen.add(o)
            unique.append(o)
    return unique


CSRF_TRUSTED_ORIGINS = _csrf_trusted_origins()

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

_on_railway = bool(os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("RAILWAY_PUBLIC_DOMAIN"))
_railway_host = os.getenv("RAILWAY_PUBLIC_DOMAIN", "").strip()
SITE_URL = os.getenv("SITE_URL", "").strip()
if not SITE_URL and _railway_host:
    SITE_URL = f"https://{_railway_host}"
elif not SITE_URL:
    SITE_URL = "http://127.0.0.1:8000"

# Cookies HTTPS en Railway
if _on_railway or not DEBUG:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_HTTPONLY = False

# ======================
# CORREO (recuperación de contraseña)
# ======================
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "true").lower() in ("1", "true", "yes")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER or "fragatagiratoria@gmail.com",
)

if EMAIL_HOST_USER and EMAIL_HOST_PASSWORD:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ======================
# APPS
# ======================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'mi_app',
    'usuarios',
    'productos',
    'inventario',
    'metodos_pago',
    'reportes',
    'contacto',
    'cuentas',
    'platillos',
    'compras',
    'pedidos',
]

AUTH_USER_MODEL = 'usuarios.Usuario'

# ======================
# MIDDLEWARE
# ======================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'fragata.middleware.DynamicCsrfTrustedOriginMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'fragata.urls'

# ======================
# TEMPLATES
# ======================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fragata.wsgi.application'

# ======================
# BASE DE DATOS (IMPORTANTE)
# ======================

if os.getenv("DATABASE_URL"):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv("DATABASE_URL"),
            conn_max_age=600
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ======================
# INTERNACIONALIZACIÓN
# ======================
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'

USE_I18N = True
USE_TZ = True

# ======================
# ARCHIVOS ESTÁTICOS
# ======================
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

# ======================
# LOGIN
# ======================
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = 'dashboard'
LOGOUT_REDIRECT_URL = 'inicio'

# ======================
# DEFAULT AUTO FIELD
# ======================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'