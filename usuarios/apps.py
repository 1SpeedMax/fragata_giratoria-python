from django.apps import AppConfig
from django.db.models.signals import post_migrate


class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'

    def ready(self):
        post_migrate.connect(self._crear_roles_y_usuarios, sender=self)

    def _crear_roles_y_usuarios(self, sender, **kwargs):
        if sender.name != 'usuarios':
            return

        from django.contrib.auth import get_user_model
        user_model = get_user_model()
        from .models import Rol

        try:
            rol_admin, _ = Rol.objects.get_or_create(nombre_rol='ADMIN', defaults={'descripcion': 'Administrador del sistema'})
            rol_cocinero, _ = Rol.objects.get_or_create(nombre_rol='COCINERO', defaults={'descripcion': 'Personal de cocina'})
            rol_mesero, _ = Rol.objects.get_or_create(nombre_rol='MESERO', defaults={'descripcion': 'Personal de meseria'})
            _, _ = Rol.objects.get_or_create(nombre_rol='CLIENTE', defaults={'descripcion': 'Cliente del restaurante'})

            admin, created = user_model.objects.get_or_create(
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
            elif admin.rol != rol_admin:
                admin.rol = rol_admin
                admin.save()

            cocinero, created = user_model.objects.get_or_create(
                email='cocinero@gmail.com',
                defaults={
                    'nombre_usuario': 'cocinero',
                    'rol': rol_cocinero
                }
            )
            if created:
                cocinero.set_password('Cocinero2026!')
                cocinero.save()
            elif cocinero.rol != rol_cocinero:
                cocinero.rol = rol_cocinero
                cocinero.save()

            mesero, created = user_model.objects.get_or_create(
                email='mesero@gmail.com',
                defaults={
                    'nombre_usuario': 'mesero',
                    'rol': rol_mesero
                }
            )
            if created:
                mesero.set_password('Mesero2026!')
                mesero.save()
            elif mesero.rol != rol_mesero:
                mesero.rol = rol_mesero
                mesero.save()

        except Exception:
            pass