from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'

    def ready(self):
        from django.db import connection

        # Evitar error si las migraciones aún no se han aplicado
        if 'usuarios_usuario' not in connection.introspection.table_names():
            return

        from django.contrib.auth import get_user_model
        User = get_user_model()
        from .models import Rol

        try:
            # CREAR ROLES
            rol_admin, _ = Rol.objects.get_or_create(nombre_rol='ADMIN', defaults={'descripcion': 'Administrador del sistema'})
            rol_cocinero, _ = Rol.objects.get_or_create(nombre_rol='COCINERO', defaults={'descripcion': 'Personal de cocina'})
            rol_mesero, _ = Rol.objects.get_or_create(nombre_rol='MESERO', defaults={'descripcion': 'Personal de mesería'})
            rol_cliente, _ = Rol.objects.get_or_create(nombre_rol='CLIENTE', defaults={'descripcion': 'Cliente del restaurante'})

            # ADMIN
            admin, created = User.objects.get_or_create(
                email='admin@gmail.com',
                defaults={
                    'nombre_usuario': 'admin',
                    'is_staff': True,
                    'is_superuser': True,
                    'rol': rol_admin
                }
            )
            if created:
                admin.set_password('Admin2026')
                admin.save()
            else:
                # Actualizar rol si no está asignado
                if admin.rol != rol_admin:
                    admin.rol = rol_admin
                    admin.save()

            # COCINERO
            cocinero, created = User.objects.get_or_create(
                email='cocinero@gmail.com',
                defaults={
                    'nombre_usuario': 'cocinero',
                    'rol': rol_cocinero
                }
            )
            if created:
                cocinero.set_password('Cocinero2026!')
                cocinero.save()
            else:
                if cocinero.rol != rol_cocinero:
                    cocinero.rol = rol_cocinero
                    cocinero.save()

            # MESERO
            mesero, created = User.objects.get_or_create(
                email='mesero@gmail.com',
                defaults={
                    'nombre_usuario': 'mesero',
                    'rol': rol_mesero
                }
            )
            if created:
                mesero.set_password('Mesero2026!')
                mesero.save()
            else:
                if mesero.rol != rol_mesero:
                    mesero.rol = rol_mesero
                    mesero.save()

        except Exception:
            # Silenciar errores si hay problemas de base de datos
            pass