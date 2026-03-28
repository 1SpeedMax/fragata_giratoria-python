import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fragata.settings')
django.setup()

from platillos.models import CategoriaPlatillo, Platillo

def insertar_categorias():
    """Insertar categorías de platillos"""
    categorias = [
        {'nombre': 'Entradas', 'emoji': '🍽️', 'activo': True, 'orden': 1},
        {'nombre': 'Platos Principales', 'emoji': '🍲', 'activo': True, 'orden': 2},
        {'nombre': 'Adiciones', 'emoji': '🍚', 'activo': True, 'orden': 3},
        {'nombre': 'Bebidas', 'emoji': '🍷', 'activo': True, 'orden': 4},
    ]
    
    categorias_creadas = []
    for cat in categorias:
        categoria, created = CategoriaPlatillo.objects.get_or_create(
            nombre=cat['nombre'],
            defaults={
                'emoji': cat['emoji'],
                'activo': cat['activo'],
                'orden': cat['orden']
            }
        )
        categorias_creadas.append((categoria, created))
        if created:
            print(f"✅ Categoría creada: {cat['emoji']} {cat['nombre']}")
        else:
            print(f"⚠️ Categoría ya existe: {cat['emoji']} {cat['nombre']}")
    
    return categorias_creadas


def insertar_platillos():
    """Insertar platillos desde los datos proporcionados"""
    
    # Obtener categorías
    entradas = CategoriaPlatillo.objects.get(nombre='Entradas')
    platos_principales = CategoriaPlatillo.objects.get(nombre='Platos Principales')
    adiciones = CategoriaPlatillo.objects.get(nombre='Adiciones')
    bebidas = CategoriaPlatillo.objects.get(nombre='Bebidas')
    
    platillos = [
        # Entradas
        {
            'nombre': 'Ceviche Clásico',
            'descripcion': 'Pescado fresco marinado en jugo de limón, cebolla morada y cilantro.',
            'categoria': entradas,
            'precio': 20000,
            'imagen_url': '/img/menu/Ceviche-Clásico.avif',
            'emojis': '🐠🍋‍🟩',
            'disponible': True,
            'destacado': True,
            'orden': 1
        },
        {
            'nombre': 'Tacos de Camarón',
            'descripcion': 'Tortillas de maíz rellenas de camarones a la parrilla, salsa de mango y aguacate.',
            'categoria': entradas,
            'precio': 30000,
            'imagen_url': '/img/menu/Tacos de Camarón.avif',
            'emojis': '🦐🥭🥑🌽',
            'disponible': True,
            'destacado': True,
            'orden': 2
        },
        {
            'nombre': 'Pulpo a la Parrilla',
            'descripcion': 'Pulpo tierno asado a la parrilla, servido con salsa de ajo y pimientos.',
            'categoria': entradas,
            'precio': 50000,
            'imagen_url': '/img/menu/PulpoParrilla.avif',
            'emojis': '🐙🧄🫑',
            'disponible': True,
            'destacado': False,
            'orden': 3
        },
        {
            'nombre': 'Sopa de Mariscos',
            'descripcion': 'Camarones, almejas y calamares en un fondo aromatizado con especias.',
            'categoria': entradas,
            'precio': 25000,
            'imagen_url': '/img/menu/SopaMariscos.avif',
            'emojis': '🐠🍋🌿',
            'disponible': True,
            'destacado': False,
            'orden': 4
        },
        
        # Platos Principales
        {
            'nombre': 'Paella de Mariscos',
            'descripcion': 'Arroz con una mezcla de mariscos frescos, azafrán y verduras.',
            'categoria': platos_principales,
            'precio': 80000,
            'imagen_url': '/img/menu/PaellaMariscos.avif',
            'emojis': '🐠🌿',
            'disponible': True,
            'destacado': True,
            'orden': 1
        },
        {
            'nombre': 'Filete de Salmón',
            'descripcion': 'Salmón a la plancha con salsa de limón y hierbas, acompañado de espárragos.',
            'categoria': platos_principales,
            'precio': 90000,
            'imagen_url': '/img/menu/Filete de Salmón.avif',
            'emojis': '🐠🍋🌿',
            'disponible': True,
            'destacado': True,
            'orden': 2
        },
        {
            'nombre': 'Langosta al Horno',
            'descripcion': 'Langosta horneada con mantequilla de ajo y hierbas, servida con puré de papas.',
            'categoria': platos_principales,
            'precio': 110000,
            'imagen_url': '/img/menu/Langosta al Horno.avif',
            'emojis': '🦞🧄🌿',
            'disponible': True,
            'destacado': True,
            'orden': 3
        },
        {
            'nombre': 'Filete de Pescado en Salsa de Coco',
            'descripcion': 'Filete de pescado blanco a la plancha, bañado en una suave salsa cremosa de coco con un toque de jengibre y limón, servido con vegetales salteados.',
            'categoria': platos_principales,
            'precio': 80000,
            'imagen_url': '/img/menu/Filete de Pescado en Salsa de Coco.avif',
            'emojis': '🐠🍋🥥',
            'disponible': True,
            'destacado': False,
            'orden': 4
        },
        
        # Adiciones
        {
            'nombre': 'Camarones',
            'descripcion': 'Porción de camarones frescos, salteados en aceite de oliva con ajo picado y un toque de perejil.',
            'categoria': adiciones,
            'precio': 15000,
            'imagen_url': '/img/menu/camarones.avif',
            'emojis': '🦐🌿',
            'disponible': True,
            'destacado': False,
            'orden': 1
        },
        {
            'nombre': 'Porción de arroz con coco',
            'descripcion': 'Arroz blanco cocido lentamente en leche de coco, con un toque dulce y salado. Acompañamiento tradicional del Caribe colombiano.',
            'categoria': adiciones,
            'precio': 6500,
            'imagen_url': '/img/menu/Porción de arroz con coco.avif',
            'emojis': '🥥🍚',
            'disponible': True,
            'destacado': False,
            'orden': 2
        },
        {
            'nombre': 'Patacones crocantes',
            'descripcion': 'Rodajas de plátano verde fritas, acompañadas con suero costeño artesanal.',
            'categoria': adiciones,
            'precio': 6000,
            'imagen_url': '/img/menu/Patacones crocantes.avif',
            'emojis': '🧂',
            'disponible': True,
            'destacado': False,
            'orden': 3
        },
        {
            'nombre': 'Vegetales salteados',
            'descripcion': 'Combinación de zanahoria, brócoli, pimentón y cebolla, salteados en mantequilla con un toque de pimienta negra y orégano.',
            'categoria': adiciones,
            'precio': 6500,
            'imagen_url': '/img/menu/Vegetales salteados.avif',
            'emojis': '🧈🥕🫑🧅',
            'disponible': True,
            'destacado': False,
            'orden': 4
        },
        
        # Bebidas
        {
            'nombre': 'Coctel frutos rojos',
            'descripcion': 'Un coctel refrescante con hielo, con frutos rojos, jugo de limón con su rodaja.',
            'categoria': bebidas,
            'precio': 25000,
            'imagen_url': '/img/menu/Coctel frutos rojos.avif',
            'emojis': '🍒🧊',
            'disponible': True,
            'destacado': True,
            'orden': 1
        },
        {
            'nombre': 'Jugo tropical',
            'descripcion': 'Un jugo fresco y delicioso con mezclas de frutas tropicales y hielo para el gusto.',
            'categoria': bebidas,
            'precio': 15000,
            'imagen_url': '/img/menu/Jugo tropical.avif',
            'emojis': '🥭🧊',
            'disponible': True,
            'destacado': False,
            'orden': 2
        },
        {
            'nombre': 'Vino intenso',
            'descripcion': 'Vino de color tinto intenso con notas de frutas negras y maduras.',
            'categoria': bebidas,
            'precio': 42000,
            'imagen_url': '/img/menu/Vino intenso.avif',
            'emojis': '🍇🧊',
            'disponible': True,
            'destacado': True,
            'orden': 3
        },
        {
            'nombre': 'Whisky',
            'descripcion': 'Destilado añejado en barricas de madera, con sabores que van desde lo ahumado y especiado hasta lo dulce y afrutado.',
            'categoria': bebidas,
            'precio': 35000,
            'imagen_url': '/img/menu/Whisky.avif',
            'emojis': '🍯🪵🧊',
            'disponible': True,
            'destacado': False,
            'orden': 4
        },
        {
            'nombre': 'Sauvignon Blanc',
            'descripcion': 'Refrescante y herbal, con frutas tropicales y acidez vibrante.',
            'categoria': bebidas,
            'precio': 34000,
            'imagen_url': '/img/menu/Sauvignon Blanc.avif',
            'emojis': '🍷🧊',
            'disponible': True,
            'destacado': False,
            'orden': 5
        },
        {
            'nombre': 'Vermentino',
            'descripcion': 'Vino blanco fresco con notas cítricas, manzana verde y un sutil toque salino.',
            'categoria': bebidas,
            'precio': 32000,
            'imagen_url': '/img/menu/Vermentino.avif',
            'emojis': '🍋🧊',
            'disponible': True,
            'destacado': False,
            'orden': 6
        },
    ]
    
    insertados = 0
    existentes = 0
    
    for p in platillos:
        platillo, created = Platillo.objects.get_or_create(
            nombre=p['nombre'],
            defaults={
                'descripcion': p['descripcion'],
                'categoria': p['categoria'],
                'precio': p['precio'],
                'imagen_url': p['imagen_url'],
                'emojis': p['emojis'],
                'disponible': p['disponible'],
                'destacado': p['destacado'],
                'orden': p['orden']
            }
        )
        if created:
            print(f"✅ Platillo insertado: {p['emojis']} {p['nombre']} - ${p['precio']}")
            insertados += 1
        else:
            print(f"⚠️ Platillo ya existe: {p['emojis']} {p['nombre']}")
            existentes += 1
    
    print(f"\n📊 RESUMEN:")
    print(f"   - Platillos insertados: {insertados}")
    print(f"   - Platillos existentes: {existentes}")
    print(f"   - Total platillos en BD: {Platillo.objects.count()}")


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 INSERTANDO DATOS DE PLATILLOS")
    print("=" * 60)
    
    # Insertar categorías
    print("\n📁 Insertando categorías...")
    insertar_categorias()
    
    # Insertar platillos
    print("\n🍽️ Insertando platillos...")
    insertar_platillos()
    
    print("\n✅ Proceso completado!")