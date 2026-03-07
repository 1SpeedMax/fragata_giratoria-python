# db_router.py

class AuthRouter:
    """
    Router para las tablas de autenticación de Django (auth, admin, sessions, contenttypes)
    Estas tablas deben ir en la base de datos 'default'
    """
    route_app_labels = {'auth', 'contenttypes', 'sessions', 'admin'}

    def db_for_read(self, model, **hints):
        """Usar base de datos default para apps de autenticación"""
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        return None

    def db_for_write(self, model, **hints):
        """Usar base de datos default para apps de autenticación"""
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Permitir relaciones si ambas apps están en auth o si una está en auth"""
        if (
            obj1._meta.app_label in self.route_app_labels or
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Solo migrar apps de auth a la base de datos 'default'"""
        if app_label in self.route_app_labels:
            return db == 'default'
        return None


class FragataRouter:
    """
    Router para las apps personalizadas del proyecto Fragata
    Estas tablas ya existen en 'fragata_db' y no deben ser migradas
    """
    route_app_labels = {
        'usuarios', 'productos', 'compras', 'pedidos', 
        'metodos_pago', 'inventario', 'reportes', 'contacto',
        'cuentas', 'platillos', 'mi_app'
    }

    def db_for_read(self, model, **hints):
        """Leer de fragata_db para apps personalizadas"""
        if model._meta.app_label in self.route_app_labels:
            return 'fragata_db'
        return None

    def db_for_write(self, model, **hints):
        """Escribir en fragata_db para apps personalizadas"""
        if model._meta.app_label in self.route_app_labels:
            return 'fragata_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Permitir relaciones entre apps personalizadas"""
        if (
            obj1._meta.app_label in self.route_app_labels and
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """NO permitir migraciones en fragata_db para apps personalizadas"""
        if app_label in self.route_app_labels:
            return False  # No migrar, las tablas ya existen
        return None