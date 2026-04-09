from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db import connection
import sys

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'
    
    # Variable para controlar que solo se ejecute UNA VEZ
    _usuarios_creados = False

    def ready(self):
        # NO ejecutar en comandos de gestión
        if self._es_comando_manage():
            return
        
        # Solo ejecutar una vez
        if self._usuarios_creados:
            return
        
        # Ejecutar creación optimizada
        self._crear_usuarios_si_no_existen()
        self._usuarios_creados = True
    
    def _es_comando_manage(self):
        """Evitar ejecutar en comandos de manage.py"""
        comandos = ['migrate', 'makemigrations', 'shell', 'test', 'collectstatic']
        return any(cmd in sys.argv for cmd in comandos)
    
    def _crear_usuarios_si_no_existen(self):
        """Crear usuarios solo si NO existen - OPTIMIZADO"""
        try:
            # Verificar si la tabla existe (UNA SOLA CONSULTA)
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.tables 
                        WHERE table_name = 'usuarios_usuario'
                    );
                """)
                if not cursor.fetchone()[0]:
                    return
            
            User = get_user_model()
            
            # Verificar si HAY usuarios (UNA SOLA CONSULTA)
            if User.objects.exists():
                # Si ya hay usuarios, NO hacer nada
                return
            
            # Solo si NO hay usuarios, crearlos (esto solo pasa UNA VEZ)
            print("📦 Creando usuarios iniciales...")
            
            # ADMIN
            User.objects.create_superuser(
                nombre_usuario='admin',
                email='admin@gmail.com',
                password='Admin2026'
            )
            
            # COCINERO
            User.objects.create_user(
                nombre_usuario='cocinero',
                email='cocinero@gmail.com',
                password='Cocinero2026!'
            )
            
            # MESERO
            User.objects.create_user(
                nombre_usuario='mesero',
                email='mesero@gmail.com',
                password='Mesero2026!'
            )
            
            print("✅ Usuarios iniciales creados exitosamente")
            
        except Exception as e:
            print(f"⚠️ Error al crear usuarios: {e}")