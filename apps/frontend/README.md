# TutorCode — Frontend

> **Proyecto Integrador | RIWI Academy | Ruta Básica 2026**  
> Plataforma de gestión de mentorías que conecta Coders, Tutores y Team Leaders.

---

## Desarrollador Frontend

| Campo | Detalle |
|-------|---------|
| Nombre | Kevin Mendoza |
| Rol | Frontend Developer |
| Branch | `Kevin-Mendoza` |
| Repositorio | [PROYECTO-MENTORIA-Y-RETROALIMENTACION](https://github.com/Zolagos/PROYECTO-MENTORIA-Y-RETROALIMENTACION) |

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | — | Estructura semántica y accesible |
| CSS3 | — | Variables, Flexbox, Grid, animaciones |
| JavaScript Vanilla | ES2020+ | Lógica SPA, validaciones, DOM |
| Git / GitHub | — | Control de versiones con GitFlow |

> **Sin frameworks.** Sin React, Angular, Vue ni jQuery. Requisito del proyecto.

---

## Cómo ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/Zolagos/PROYECTO-MENTORIA-Y-RETROALIMENTACION.git

# 2. Entrar a la carpeta del frontend
cd PROYECTO-MENTORIA-Y-RETROALIMENTACION

# 3. Abrir con Live Server (VS Code) o doble click en index.html
```

> No requiere npm, node ni instalación de dependencias. HTML/CSS/JS puro.

---

## Estructura del Proyecto

```
├── index.html                  → Entry point (redirige al login)
│
├── pages/
│   ├── login.html              → Pantalla de autenticación
│   └── app.html                → Shell SPA (contiene sidebar + header)
│
├── css/
│   ├── main.css                → Variables CSS, reset, tipografía
│   ├── layout.css              → Header, sidebar, estructura general
│   ├── components.css          → Botones, cards, badges, tablas, modales
│   ├── animations.css          → Transiciones y animaciones
│   ├── responsive.css          → Media queries (mobile first)
│   └── pages/
│       ├── login.css           → Estilos de la pantalla de login
│       ├── dashboard.css       → Estilos del dashboard y métricas
│       ├── mentoring.css       → Estilos de la página de mentorías
│       └── observations.css    → Estilos de observaciones y feedback
│
├── js/
│   ├── utils.js                → Modales, toasts, debounce, fechas
│   ├── router.js               → Enrutador SPA basado en hash
│   ├── app.js                  → Inicialización y renders de vistas
│   ├── components/
│   │   ├── sidebar.js          → Sidebar dinámico por rol de usuario
│   │   └── header.js           → Header con menú de usuario
│   ├── pages/
│   │   ├── login.js            → Validación y lógica del login
│   │   ├── dashboard.js        → Interacciones del dashboard
│   │   ├── mentoring.js        → Filtros, modales, acciones de mentorías
│   │   ├── observations.js     → Lógica de observaciones
│   │   └── feedback.js         → Calificación por estrellas y feedback
│   └── services/
│       ├── api.js              → Capa de servicios REST (preparada para Sprint 4)
│       └── auth.js             → Flujo de autenticación Firebase (preparado)
│
└── assets/
    ├── icons/
    └── images/
```

---

## Arquitectura de la SPA

El frontend usa navegación **SPA (Single Page Application)** basada en hash:

```
URL: pages/app.html#/dashboard
              ↓
         router.js
              ↓
    Lee el hash: '/dashboard'
              ↓
    Llama renderDashboard()
              ↓
    Inyecta HTML en #page-content
              ↓
    Llama initDashboard() (event listeners)
```

**¿Por qué hash-based?**  
No requiere servidor. Funciona con `file://` y con GitHub Pages sin configuración adicional.

---

## Roles y Dashboards

| Rol | Dashboard | Acceso a |
|-----|-----------|----------|
| CODER | Dashboard Coder | Mis mentorías, Feedback |
| TUTOR | Dashboard Tutor | Mentorías, Mis Coders, Observaciones |
| TL | Dashboard TL | Todo + Métricas + Usuarios |
| ADMIN | Dashboard Admin | Acceso completo + Configuración |

El sidebar se construye **dinámicamente** según el rol. Esto significa que un Coder nunca ve opciones de TL, y viceversa.

---

## Flujo de Autenticación (Sprint 4)

```
Usuario ingresa email + password
         ↓
   Firebase Authentication
   (valida credenciales)
         ↓
   Devuelve ID Token
         ↓
   Backend Express
   (Firebase Admin SDK verifica token)
         ↓
   PostgreSQL: busca usuario por firebase_uid
         ↓
   ¿Usuario activo? → SÍ → Devuelve perfil (id, nombre, rol, clan)
                   → NO → Acceso denegado
         ↓
   Frontend guarda perfil en sessionStorage
         ↓
   Redirige al dashboard según rol
```

**Archivos involucrados:**
- `js/pages/login.js` → captura y valida el formulario
- `js/services/auth.js` → llama a Firebase + backend
- `js/services/api.js` → `fetchAPI('/auth/verify', ...)`

---

## Sistema de Diseño

### Paleta de colores

```css
--color-primary:       #1877F2   /* Azul principal */
--color-primary-dark:  #0f5fcf   /* Azul hover */
--color-accent-green:  #00C48C   /* Éxito / activo */
--color-accent-orange: #FF6B35   /* Pendiente / alerta */
--color-accent-red:    #E53935   /* Error / cancelado */
--color-sidebar-bg:    #18191A   /* Sidebar oscuro */
--color-bg:            #F0F2F5   /* Fondo general */
```

### Tipografía
- Fuente: `Segoe UI` / `system-ui` (sin carga externa)
- Escala: xs(12) → sm(14) → base(16) → lg(18) → xl(20) → 2xl(24) → 3xl(30)

### Espaciado
Sistema de 4px: `--space-1` (4px) hasta `--space-12` (48px)

---

## Decisiones Técnicas

### ¿Por qué Variables CSS en lugar de SASS?
Variables CSS son nativas del navegador. No necesitan compilación, son más simples de mantener y cualquier persona del equipo puede entenderlas sin conocer SASS.

### ¿Por qué SPA con hash en vez de páginas separadas?
El requisito técnico del proyecto exige navegación SPA. El hash permite cambiar la vista sin recargar la página, y funciona sin servidor backend.

### ¿Por qué SVG inline en lugar de íconos de librería?
No dependemos de CDN ni librerías externas (Font Awesome, etc.). El proyecto funciona offline y el bundle es más ligero.

### ¿Por qué centralizar los fetch en `api.js`?
Si el equipo de backend cambia una ruta (ej: `/api/mentorias` → `/api/v2/mentorias`), solo se cambia en un lugar. No hay que buscar en 10 archivos.

### ¿Por qué sessionStorage y no localStorage?
sessionStorage se borra automáticamente al cerrar la pestaña. Más seguro para tokens de autenticación en equipos compartidos.

---

## Evidencia GitFlow

| Commit | Mensaje | Sprint |
|--------|---------|--------|
| `3bb5528` | feat: Initialize frontend structure | Sprint 1 |
| `1d0305f` | feat: Build visual pages and interactions | Sprint 2 & 3 |
| *(próximo)* | feat: Polish UI, animations and docs | Sprint 5 |

**Estrategia:**
- Branch de trabajo: `Kevin-Mendoza`
- Nunca se trabajó directamente en `main`
- Pull Request hacia `main` al finalizar

---

## Testing Manual

### Login
- [x] Email vacío → muestra error
- [x] Email formato inválido → muestra error
- [x] Contraseña < 6 chars → muestra error
- [x] Toggle mostrar/ocultar contraseña
- [x] Spinner durante el submit
- [x] Redirige a `app.html` con credenciales válidas

### Sidebar
- [x] Rol TL ve: Dashboard, Mentorías, Usuarios, Observaciones, Feedback, Métricas
- [x] Rol CODER ve: Dashboard, Mis Mentorías, Feedback
- [x] Rol TUTOR ve: Dashboard, Mentorías, Mis Coders, Observaciones
- [x] Colapsar/expandir en desktop
- [x] Drawer en mobile con overlay

### Mentorías
- [x] Cards se renderizan con datos de muestra
- [x] Búsqueda filtra en tiempo real
- [x] Toggle entre vista grilla y lista
- [x] Menú de acciones (3 puntos) por card
- [x] Modal "Nueva Mentoría" se abre y valida campos

### Observaciones
- [x] Timeline se renderiza
- [x] Lista de coders en sidebar
- [x] Modal "Nueva Observación" valida campos requeridos

### Feedback
- [x] Estrellas de calificación interactivas
- [x] Modal "Dar Feedback" valida rating y comentario
- [x] Toast de confirmación al enviar

### Responsive
- [x] Login: solo formulario en mobile
- [x] Sidebar: drawer en mobile, colapsable en desktop
- [x] Stats grid: 4 cols → 2 cols → 1 col
- [x] Modales: bottom sheet en mobile

---

## Pendiente (conectar con backend)

Cuando el equipo de backend tenga los endpoints listos:

1. **Autenticación:** descomentar código en `js/services/auth.js` y `js/pages/login.js`
2. **Mentorías:** reemplazar datos de muestra en `getMentoringCards()` por `await mentoringService.getAll()`
3. **Observaciones:** reemplazar `getObservationsTimeline()` por `await observationsService.getAll()`
4. **Feedback:** reemplazar datos de muestra por `await feedbackService.getAll()`
5. **Dashboard stats:** conectar contadores con `await usersService.getAll()` y filtros

Todos los servicios están en `js/services/api.js` con sus endpoints documentados.

---

*TutorLink — Proyecto Integrador RIWI 2026*  
*"Porque el siguiente nivel no se alcanza solo, se construye en equipo."*
