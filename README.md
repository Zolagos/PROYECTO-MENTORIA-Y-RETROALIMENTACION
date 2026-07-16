# PROYECTO-MENTORIA-Y-RETROALIMENTACION
# Sistema de Mentorías y Retroalimentación

Plataforma web para la gestión de mentorías, retroalimentaciones y seguimiento académico dentro de Riwi.

---

## Objetivo

Centralizar el proceso de creación, asignación y seguimiento de mentorías mediante una plataforma web con autenticación segura y control de roles.

---

# Estado del proyecto

🚧 En desarrollo

Actualmente se encuentra implementado:

- Autenticación con Google mediante Firebase
- Verificación de tokens en Backend
- Arquitectura modular
- API REST
- Base del Frontend

---

# Tecnologías

## Frontend

- HTML5
- CSS3
- JavaScript ES6+
- Vite
- Firebase Authentication

## Backend

- Node.js
- Express.js
- Firebase Admin SDK
- REST API

## Base de datos

- PostgreSQL

## Infraestructura

- Docker
- Docker Compose

## Herramientas

- Git
- GitHub
- Postman
- Figma
- Notion

---

# Arquitectura

Frontend

↓

Firebase Authentication

↓

Backend Express

↓

PostgreSQL

---

# Funcionalidades implementadas

- Login con Google
- Validación de Firebase ID Token
- Middleware de autenticación
- Endpoint Login
- Endpoint Usuario autenticado

---

# Funcionalidades en desarrollo

- Dashboard
- Gestión de usuarios
- Gestión de roles
- Gestión de tutorías
- Calendario
- Perfil de usuario
- Historial de mentorías
- Sistema de retroalimentación
- Reportes
- Panel administrativo

---

# Roles

- Administrador
- Team Leader
- Tutor
- Coder

---

# Seguridad

- Firebase Authentication
- Firebase Admin SDK
- Tokens JWT de Firebase
- Middleware de autorización
- Helmet
- CORS

---

# Instalación

## Backend

```bash
cd apps/backend

npm install

npm run dev
```

## Frontend

```bash
cd apps/frontend

npm install

npm run dev
```

---

# Variables de entorno

## Frontend

```
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=
```

## Backend

```
PORT=

credenciales Firebase Admin
```

---

# Roadmap

- [x] Configuración del proyecto
- [x] Firebase Authentication
- [x] Login con Google
- [x] Validación de Token
- [ ] Dashboard
- [ ] Gestión de Usuarios
- [ ] Gestión de Roles
- [ ] Tutorías
- [ ] Retroalimentación
- [ ] Reportes
- [ ] Panel Administrativo

---

# Equipo

Proyecto desarrollado para el Proyecto Integrador de Riwi.


