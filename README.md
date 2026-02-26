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

* **Models** – Representación de entidades y base de datos
* **Views** – Lógica del sistema
* **Templates** – Interfaz de usuario
* **URLs** – Enrutamiento del sistema

---

# 🚀 Instalación y Ejecución del Proyecto

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Aetheresa/FragataGiratoria-Python.git
cd FragataGiratoria-Python
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

## 5️⃣ Configurar variables de entorno (.env)

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_NAME=fragata_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=django_secret_key
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

## ✔️ Resultado Esperado

* Sistema web funcional
* Gestión completa de ventas y pedidos
* Control de inventario
* Administración de usuarios y roles

---

## 👥 Integrantes

**SCRUM 1**

* 👩‍💻 Arleidis Beatriz Coronado
* 👨‍💻 Nicolas Losada Méndez

---

## 📄 Licencia

Proyecto desarrollado con fines académicos y de aprendizaje.

---

## 📬 Soporte

Para sugerencias o mejoras, abre un *issue* en el repositorio.

---

✨ **La Fragata Giratoria – Tecnología al servicio del buen sabor** ✨
