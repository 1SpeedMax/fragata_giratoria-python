from .models import Producto, UnidadMedida


def cargar_productos():
    if Producto.objects.exists():
        return

    # Crear unidades
    unidad, _ = UnidadMedida.objects.get_or_create(nombre="Unidad")
    kg, _ = UnidadMedida.objects.get_or_create(nombre="Kilogramo")
    litro, _ = UnidadMedida.objects.get_or_create(nombre="Litro")

    productos = [
        # 🦐 MARISCOS
        {"nombre": "Camarones", "precio": 15000, "unidad": kg},
        {"nombre": "Langostinos", "precio": 20000, "unidad": kg},
        {"nombre": "Pulpo", "precio": 25000, "unidad": kg},
        {"nombre": "Calamares", "precio": 18000, "unidad": kg},
        {"nombre": "Almejas", "precio": 12000, "unidad": kg},
        {"nombre": "Mejillones", "precio": 13000, "unidad": kg},
        {"nombre": "Filete de pescado", "precio": 17000, "unidad": kg},
        {"nombre": "Salmón", "precio": 30000, "unidad": kg},
        {"nombre": "Langosta", "precio": 50000, "unidad": kg},

        # 🍚 GRANOS Y BÁSICOS
        {"nombre": "Arroz", "precio": 3000, "unidad": kg},
        {"nombre": "Frijoles", "precio": 4000, "unidad": kg},
        {"nombre": "Lentejas", "precio": 3500, "unidad": kg},
        {"nombre": "Harina de trigo", "precio": 2500, "unidad": kg},
        {"nombre": "Azúcar", "precio": 2800, "unidad": kg},
        {"nombre": "Sal", "precio": 1500, "unidad": kg},

        # 🥔 VERDURAS
        {"nombre": "Papa", "precio": 2000, "unidad": kg},
        {"nombre": "Yuca", "precio": 1800, "unidad": kg},
        {"nombre": "Plátano verde", "precio": 2000, "unidad": kg},
        {"nombre": "Zanahoria", "precio": 1500, "unidad": kg},
        {"nombre": "Cebolla blanca", "precio": 2000, "unidad": kg},
        {"nombre": "Cebolla morada", "precio": 2200, "unidad": kg},
        {"nombre": "Tomate", "precio": 2500, "unidad": kg},
        {"nombre": "Pimentón", "precio": 3000, "unidad": kg},
        {"nombre": "Ajo", "precio": 5000, "unidad": kg},
        {"nombre": "Brócoli", "precio": 4000, "unidad": kg},
        {"nombre": "Lechuga", "precio": 2000, "unidad": unidad},
        {"nombre": "Espárragos", "precio": 8000, "unidad": kg},

        # 🥥 FRUTAS
        {"nombre": "Limón", "precio": 2000, "unidad": kg},
        {"nombre": "Mango", "precio": 3000, "unidad": kg},
        {"nombre": "Aguacate", "precio": 2500, "unidad": unidad},
        {"nombre": "Coco", "precio": 4000, "unidad": unidad},
        {"nombre": "Piña", "precio": 3500, "unidad": unidad},
        {"nombre": "Maracuyá", "precio": 3000, "unidad": kg},

        # 🧂 CONDIMENTOS
        {"nombre": "Aceite de oliva", "precio": 20000, "unidad": litro},
        {"nombre": "Vinagre", "precio": 5000, "unidad": litro},
        {"nombre": "Pimienta", "precio": 8000, "unidad": kg},
        {"nombre": "Comino", "precio": 7000, "unidad": kg},
        {"nombre": "Cilantro", "precio": 1500, "unidad": unidad},
        {"nombre": "Perejil", "precio": 1500, "unidad": unidad},

        # 🧈 LÁCTEOS
        {"nombre": "Mantequilla", "precio": 6000, "unidad": kg},
        {"nombre": "Leche", "precio": 4000, "unidad": litro},
        {"nombre": "Crema de leche", "precio": 5000, "unidad": litro},
        {"nombre": "Queso", "precio": 10000, "unidad": kg},

        # 🍷 BEBIDAS
        {"nombre": "Vino blanco", "precio": 30000, "unidad": litro},
        {"nombre": "Vino tinto", "precio": 32000, "unidad": litro},
        {"nombre": "Whisky", "precio": 50000, "unidad": litro},
        {"nombre": "Ron", "precio": 40000, "unidad": litro},
        {"nombre": "Agua", "precio": 2000, "unidad": litro},
    ]

    for p in productos:
        Producto.objects.get_or_create(
            nombre=p["nombre"],
            defaults={
                "precio_unitario": p["precio"],
                "stock_actual": 50,
                "stock_minimo": 10,
                "cantidad": 1,
                "unidad_medida": p["unidad"]
            }
        )