from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'

    def ready(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        # ADMIN
        if not User.objects.filter(nombre_usuario='admin').exists():
            User.objects.create_superuser(
                nombre_usuario='admin',
                email='admin@gmail.com',
                password='Admin2026!'
            )

        # COCINERO
        if not User.objects.filter(nombre_usuario='cocinero').exists():
            User.objects.create_user(
                nombre_usuario='cocinero',
                email='cocinero@gmail.com',
                password='Cocinero2026!'
            )

        # MESERO
        if not User.objects.filter(nombre_usuario='mesero').exists():
            User.objects.create_user(
                nombre_usuario='mesero',
                email='mesero@gmail.com',
                password='Mesero2026!'
            )