from django.apps import AppConfig
from django.db.models.signals import post_migrate

class TuAppConfig(AppConfig):
    name = 'mi_app'  # <--- CAMBIA ESTO POR EL NOMBRE DE TU CARPETA

    def ready(self):
       # post_migrate.connect(self.cargar_platillos_iniciales, sender=self)

    #def cargar_platillos_iniciales(self, sender, **kwargs):
        Platillo = self.get_model('Platillo')
        CategoriaPlatillo = self.get_model('CategoriaPlatillo')

        if not Platillo.objects.exists():
            print("--- Cargando platillos iniciales ---")
            
            categorias = {
                'Entradas': CategoriaPlatillo.objects.get_or_create(nombre='Entradas')[0],
                'Platos Principales': CategoriaPlatillo.objects.get_or_create(nombre='Platos Principales')[0],
                'Adiciones': CategoriaPlatillo.objects.get_or_create(nombre='Adiciones')[0],
                'Bebidas': CategoriaPlatillo.objects.get_or_create(nombre='Bebidas')[0],
            }
            
            datos = [
    ('Ceviche Clásico', 'Pescado fresco marinado en jugo de limón, cebolla morada y cilantro.', 20000, 'Entradas', '/img/menu/Ceviche-Clásico.avif', '🐠🍋‍🟩'),
    ('Tacos de Camarón', 'Tortillas de maíz rellenas de camarones a la parrilla, salsa de mango y aguacate.', 30000, 'Entradas', '/img/menu/Tacos de Camarón.avif', '🦐🥭🥑🌽'),
    ('Pulpo a la Parrilla', 'Pulpo tierno asado a la parrilla, servido con salsa de ajo y pimientos.', 50000, 'Entradas', '/img/menu/PulpoParrilla.avif', '🐙🧄🫑'),
    ('Sopa de Mariscos', 'Camarones, almejas y calamares en un fondo aromatizado con especias.', 25000, 'Entradas', '/img/menu/SopaMariscos.avif', '🐠🍋🌿'),
    ('Paella de Mariscos', 'Arroz con una mezcla de mariscos frescos, azafrán y verduras.', 80000, 'Platos Principales', '/img/menu/PaellaMariscos.avif', '🐠🌿'),
    ('Filete de Salmón', 'Salmón a la plancha con salsa de limón y hierbas, acompañado de espárragos.', 90000, 'Platos Principales', '/img/menu/Filete de Salmón.avif', '🐠🍋🌿'),
    ('Langosta al Horno', 'Langosta horneada con mantequilla de ajo y hierbas, servida con puré de papas.', 110000, 'Platos Principales', '/img/menu/Langosta al Horno.avif', '🦞🧄🌿'),
    ('Filete de Pescado en Salsa de Coco', 'Filete de pescado blanco a la plancha, bañado en una suave salsa cremosa de coco.', 80000, 'Platos Principales', '/img/menu/Filete de Pescado en Salsa de Coco.avif', '🐠🍋🥥'),
    ('Camarones', 'Porción de camarones frescos, salteados en aceite de oliva con ajo picado.', 15000, 'Adiciones', '/img/menu/camarones.avif', '🦐🌿'),
    ('Porción de arroz con coco', 'Arroz blanco cocido lentamente en leche de coco.', 6500, 'Adiciones', '/img/menu/Porción de arroz con coco.avif', '🥥🍚'),
    ('Patacones crocantes', 'Rodajas de plátano verde fritas, acompañadas con suero costeño.', 6000, 'Adiciones', '/img/menu/Patacones crocantes.avif', '🧂'),
    ('Vegetales salteados', 'Combinación de vegetales salteados en mantequilla.', 6500, 'Adiciones', '/img/menu/Vegetales salteados.avif', '🧈🥕🫑🧅'),
    ('Coctel frutos rojos', 'Un coctel refrescante con hielo, con frutos rojos.', 25000, 'Bebidas', '/img/menu/Coctel frutos rojos.avif', '🍒🧊'),
    ('Jugo tropical', 'Un jugo fresco y delicioso con mezclas de frutas tropicales.', 15000, 'Bebidas', '/img/menu/Jugo tropical.avif', '🥭🧊'),
    ('Vino intenso', 'Vino de color tinto intenso con notas de frutas negras y maduras.', 42000, 'Bebidas', '/img/menu/Vino intenso.avif', '🍇🧊'),
    ('Whisky', 'Destilado añejado en barricas de madera.', 35000, 'Bebidas', '/img/menu/Whisky.avif', '🍯🪵🧊'),
    ('Sauvignon Blanc', 'Refrescante y herbal, con frutas tropicales y acidez vibrante.', 34000, 'Bebidas', '/img/menu/Sauvignon Blanc.avif', '🍷🧊'),
    ('Vermentino', 'Vino blanco fresco con notas cítricas y manzana verde.', 32000, 'Bebidas', '/img/menu/Vermentino.avif', '🍋🧊'),
]

            for nombre, desc, precio, cat_nombre, img, emojis in datos:
                cat_obj = categorias[cat_nombre]
                Platillo.objects.create(
                    nombre=nombre, 
                    descripcion=desc, 
                    precio=precio, 
                    categoria=cat_obj, 
                    imagen_url=img, 
                    emojis=emojis
                )
            print("--- Carga completada automáticamente ---")