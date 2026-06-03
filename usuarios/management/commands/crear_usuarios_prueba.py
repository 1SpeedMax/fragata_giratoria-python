# usuarios/management/commands/crear_usuarios_prueba.py
from django.core.management.base import BaseCommand
from usuarios.models import Usuario, Rol


class Command(BaseCommand):
    help = 'Crea usuarios de prueba con correos diferentes al tuyo'

    def handle(self, *args, **options):
        # Obtener o crear el rol CLIENTE
        rol_cliente, _ = Rol.objects.get_or_create(
            nombre_rol='CLIENTE',
            defaults={'descripcion': 'Cliente del restaurante'}
        )

        usuarios_prueba = [
            {
                'nombre_usuario': 'maria',
                'email': 'maria@gmail.com',
                'password': 'Maria1234!',
            },
            {
                'nombre_usuario': 'juan',
                'email': 'juan@hotmail.com',
                'password': 'Juan1234!',
            },
            {
                'nombre_usuario': 'pedro',
                'email': 'pedro@yahoo.com',
                'password': 'Pedro1234!',
            },
        ]

        for data in usuarios_prueba:
            email = data.pop('email')
            password = data.pop('password')
            
            if not Usuario.objects.filter(email=email).exists():
                try:
                    usuario = Usuario.objects.create_user(
                        email=email,
                        password=password,
                        rol=rol_cliente,
                        estado='ACTIVO',
                        **data
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ {email} (pass: {password})')
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'❌ {email}: {e}')
                    )
            else:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ Ya existe: {email}')
                )

        self.stdout.write(self.style.SUCCESS('\n🎉 Proceso completado'))
