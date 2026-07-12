# TutorLink — Frontend

**Proyecto Integrador | RIWI Academy | Ruta Básica 2026**

TutorLink es una plataforma de gestión de mentorías que conecta Coders, Tutores y Team Leaders de RIWI.

---

## Desarrollador Frontend

**Kevin Mendoza** — Frontend Developer  
Branch: `Kevin-Mendoza`

---

## Tecnologías

- HTML5 (semántico, accesible)
- CSS3 (Variables CSS, Flexbox, Grid, diseño responsive)
- JavaScript Vanilla (SPA sin frameworks)
- Sin jQuery. Sin React. Sin Angular. Sin Vue.

---

## Estructura del Proyecto

```
├── index.html              → Redirige al login
├── pages/
│   ├── login.html          → Pantalla de inicio de sesión
│   └── app.html            → Shell SPA principal
├── css/
│   ├── main.css            → Variables globales, reset, tipografía
│   ├── layout.css          → Header, sidebar, footer
│   ├── components.css      → Botones, cards, badges, tablas, formularios
│   └── pages/
│       ├── login.css       → Estilos específicos del login
│       └── dashboard.css   → Estilos específicos del dashboard
├── js/
│   ├── router.js           → Enrutador SPA (hash-based)
│   ├── app.js              → Inicialización y render de páginas
│   ├── components/
│   │   ├── sidebar.js      → Sidebar dinámico por rol
│   │   └── header.js       → Header y menú de usuario
│   └── pages/
│       ├── login.js        → Validación y lógica de login
│       ├── mentoring.js    → Lógica de mentorías (Sprint 3)
│       ├── observations.js → Lógica de observaciones (Sprint 3)
│       └── feedback.js     → Lógica de feedback (Sprint 3)
└── assets/
    ├── icons/
    └── images/
```

---

## Cómo ejecutar

1. Clona el repositorio
2. Abre `index.html` en tu navegador (con Live Server recomendado)
3. Serás redirigido automáticamente al login

> No requiere instalación de dependencias. HTML/CSS/JS puro.

---

## Roles del sistema

| Rol    | Descripción |
|--------|-------------|
| CODER  | Ve sus mentorías y puede dar feedback |
| TUTOR  | Gestiona mentorías y registra observaciones |
| TL     | Supervisa todo el programa y ve métricas |
| ADMIN  | Acceso completo al sistema |

---

## Estado del desarrollo

| Sprint | Estado | Descripción |
|--------|--------|-------------|
| Sprint 1 | ✅ Completo | Estructura, CSS base, layout, componentes, login |
| Sprint 2 | 🔄 En progreso | Páginas visuales completas |
| Sprint 3 | ⏳ Pendiente | JavaScript interactivo |
| Sprint 4 | ⏳ Pendiente | Conexión con backend |
| Sprint 5 | ⏳ Pendiente | Pulido y documentación final |

---

## Control de Versiones

- Branch de trabajo: `Kevin-Mendoza`
- Estrategia: GitFlow
- PRs hacia: `develop`
