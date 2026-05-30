# 🍽️ La Fragata Giratoria

**Sistema POS y Gestión de Ventas para Restaurante**

![Backend](https://img.shields.io/badge/Backend-Django-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blueviolet)
![Language](https://img.shields.io/badge/Language-Python-yellow)

---

## 📌 Descripción

**La Fragata Giratoria** es un sistema POS (Point of Sale) y de gestión integral desarrollado para restaurantes, diseñado para centralizar y optimizar los procesos operativos diarios como el control de ventas, pedidos, inventario y administración de usuarios.

El sistema opera en entorno web, permitiendo acceso seguro, control en tiempo real y una mejor experiencia tanto para el personal como para los clientes.

---

## 🎯 Objetivo General

Diseñar e implementar un sistema POS integral que optimice la gestión de pedidos, ventas e inventario del restaurante **La Fragata Giratoria**, fortaleciendo el control administrativo y la experiencia del cliente.

### Objetivos Específicos

* Automatizar el registro y seguimiento de pedidos
* Controlar el inventario de forma eficiente
* Reducir tiempos de atención
* Facilitar la toma de decisiones administrativas
* Centralizar la gestión de usuarios y roles

---

## ⚙️ Funcionalidades Principales

* 🧾 **Registro y control de ventas**

* 📦 **Gestión de productos e inventario**

* 🛒 **Sistema de pedidos**

* 👥 **Gestión de roles de usuario**

  * 👨‍💼 Administrador
  * 🧑‍🍳 Cocina
  * 🧑‍💼 Mesero
  * 👤 Cliente

* 🔐 **Sistema de autenticación**

* 📊 **Panel administrativo**

---

## 🛠️ Tecnologías Utilizadas

### Backend

* 🐍 Python 3
* 🌐 Django

### Frontend

* 🎨 HTML5
* 🎨 CSS3
* ⚙️ JavaScript

### Base de Datos

* 🗄️ PostgreSQL

### Control de Versiones

* 🧩 Git
* 🐙 GitHub

---

## 🏗️ Arquitectura

Arquitectura basada en el patrón **MTV (Model – Template – View)** de Django:

* **Models** – Base de datos
* **Views** – Lógica del sistema
* **Templates** – Interfaz
* **URLs** – Enrutamiento

---

# 🚀 Instalación y Ejecución del Proyecto

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/1SpeedMax/fragata_giratoria-python.git
cd fragata_giratoria-python
```

---

## 2️⃣ Crear entorno virtual

```bash
python -m venv venv
```

---

## 3️⃣ Activar entorno virtual (Windows)

```bash
venv\Scripts\activate
```

---

## 4️⃣ Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## 5️⃣ Configurar base de datos en PostgreSQL

Editar el archivo `settings.py` y colocar:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fragata_db',
        'USER': 'postgres',
        'PASSWORD': 'PON_TU_CONTRASEÑA_AQUI',  
        'HOST': '127.0.0.1',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },
    }
}
```
⚠️ Nota: Asegúrate de tener PostgreSQL instalado y configurado.
La contraseña debe coincidir con la configurada en tu sistema.

---

## 🗄️ Crear la base de datos

Antes de ejecutar el proyecto, crea la base en PostgreSQL:

1️⃣ Abrir la terminal (CMD)  

2️⃣ Entrar a PostgreSQL:
```bash
psql -U postgres
```

3️⃣ Crear la base de datos:

```sql
CREATE DATABASE fragata_db;
```
4️⃣ Verificar que se creó:

```bash
\l
```
5️⃣ Salir de PostgreSQL:

```bash
\q
```

---

## 6️⃣ Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 7️⃣ Ejecutar servidor

```bash
python manage.py runserver
```

---

## 🌐 Acceso

```
http://127.0.0.1:8000/
```

---

## 🚂 Despliegue en Railway (imágenes del menú)

Para que los platillos y sus fotos se vean en producción:

1. **PostgreSQL** enlazado al servicio web (variable `DATABASE_URL` automática).
2. **Variables** en Railway → Settings → Variables:
   - `SECRET_KEY` = una clave larga y aleatoria
   - (opcional) `RAILWAY_PUBLIC_DOMAIN` la define Railway sola
3. **Sube el código** con la carpeta `static/img/menu/` (18 archivos `.avif`):
   ```bash
   git add static/img/menu railway.toml Procfile platillos/
   git commit -m "deploy: platillos e imágenes para Railway"
   git push origin main
   ```
4. En cada deploy, Railway ejecuta:
   - `collectstatic` → publica imágenes con WhiteNoise
   - `migrate` + `cargar_platillos` → carga/actualiza los 18 platillos en la BD

Tras el deploy, entra a `/platillos/` en tu URL de Railway.

### Correo (recuperar contraseña)

En Railway → Variables, añade (Gmail con contraseña de aplicación):

| Variable | Ejemplo |
|----------|---------|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USE_TLS` | `true` |
| `EMAIL_HOST_USER` | `tu_correo@gmail.com` |
| `EMAIL_HOST_PASSWORD` | contraseña de aplicación de 16 caracteres |
| `DEFAULT_FROM_EMAIL` | mismo que `EMAIL_HOST_USER` |
| `SITE_URL` | `https://fragatagiratoriapython-production.up.railway.app` |

Sin esas variables, el correo solo se imprime en los logs del servidor (no llega al usuario).

---

## ✔️ Resultado Esperado

* Sistema web funcionando correctamente
* Registro de usuarios
* Gestión de pedidos y ventas
* Control de inventario
* Panel administrativo operativo

---

## 👥 Integrantes

**SCRUM 1**

* 👩‍💻 Arleidis Beatriz Coronado
* 👨‍💻 Nicolas Losada Méndez

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.

---

## 📬 Soporte

Para sugerencias o mejoras, abre un *issue* en el repositorio.

---

✨ **La Fragata Giratoria – Tecnología al servicio del buen sabor** ✨

