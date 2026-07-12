/**
 * router.js — Enrutador SPA de TutorLink
 *
 * ¿Qué hace?
 * Maneja la navegación sin recargar la página.
 * Cada "ruta" corresponde a una vista (función que devuelve HTML).
 * Cuando el usuario navega, solo cambia el contenido de #page-content.
 *
 * ¿Por qué así?
 * SPA (Single Page Application) es el requisito del proyecto.
 * Sin frameworks, lo hacemos con el hash (#) de la URL.
 * Ejemplo: app.html#/dashboard → muestra el dashboard
 *
 * Kevin Mendoza | Frontend Developer
 */

// ---- REGISTRO DE RUTAS ----
// Cada entrada: ruta → { title, render }
// render: función que devuelve el HTML de esa vista
const routes = {};

/**
 * Registra una ruta en el enrutador.
 * @param {string} path - Ruta (ej: '/dashboard')
 * @param {string} title - Título que aparece en el header
 * @param {Function} render - Función que devuelve el HTML de la vista
 */
function registerRoute(path, title, render) {
  routes[path] = { title, render };
}

/**
 * Navega a una ruta sin recargar la página.
 * @param {string} path - Ruta a navegar (ej: '/dashboard')
 */
function navigateTo(path) {
  // Cambia el hash de la URL sin recargar
  window.location.hash = path;
}

/**
 * Función principal que renderiza la ruta activa.
 * Se ejecuta cuando cambia el hash o al cargar la app.
 */
function handleRoute() {
  // Obtiene la ruta del hash, sin el '#'
  const rawHash = window.location.hash.slice(1) || '/dashboard';

  // Separa la ruta de posibles parámetros (ej: /mentoring/123 → /mentoring/:id)
  const path = rawHash.split('?')[0];

  // Busca la ruta en el registro
  const route = routes[path];

  // Referencia al contenedor principal
  const pageContent = document.getElementById('page-content');
  const pageTitle   = document.getElementById('header-page-title');

  if (!pageContent) return;

  if (route) {
    // Actualiza el título del header
    if (pageTitle) pageTitle.textContent = route.title;
    // Actualiza el título de la pestaña del navegador
    document.title = `TutorLink — ${route.title}`;
    // Inyecta el HTML de la vista
    pageContent.innerHTML = route.render();
    // Marca el item activo en el sidebar
    updateSidebarActive(path);
    // Ejecuta el script de inicialización de la vista si existe
    initPageScript(path);
  } else {
    // Ruta no encontrada → página 404
    if (pageTitle) pageTitle.textContent = 'Página no encontrada';
    document.title = 'TutorLink — 404';
    pageContent.innerHTML = render404();
  }
}

/**
 * Marca el item activo en el sidebar según la ruta actual.
 * @param {string} activePath - Ruta activa
 */
function updateSidebarActive(activePath) {
  const navItems = document.querySelectorAll('.sidebar__nav-item');
  navItems.forEach(item => {
    const itemPath = item.dataset.route;
    if (itemPath === activePath) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });
}

/**
 * Ejecuta la función de inicialización de cada página si existe.
 * Cada archivo en js/pages/ puede exportar una función initPage().
 * @param {string} path - Ruta activa
 */
function initPageScript(path) {
  // Mapa de rutas a sus funciones de init
  const pageInits = {
    '/dashboard':    typeof initDashboard    === 'function' ? initDashboard    : null,
    '/mentoring':    typeof initMentoring    === 'function' ? initMentoring    : null,
    '/observations': typeof initObservations === 'function' ? initObservations : null,
    '/feedback':     typeof initFeedback     === 'function' ? initFeedback     : null,
    '/users':        typeof initUsers        === 'function' ? initUsers        : null,
  };

  const init = pageInits[path];
  if (init) {
    // Pequeño timeout para asegurar que el DOM ya fue inyectado
    setTimeout(init, 0);
  }
}

/**
 * HTML de la página 404
 */
function render404() {
  return `
    <div class="empty-state">
      <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2 class="empty-state__title">Página no encontrada</h2>
      <p class="empty-state__description">
        La ruta que buscas no existe en TutorLink.
      </p>
      <button class="btn btn-primary" onclick="navigateTo('/dashboard')">
        Ir al Dashboard
      </button>
    </div>
  `;
}

// ---- ESCUCHA CAMBIOS DE HASH ----
// Se ejecuta cada vez que el usuario hace click en un link del sidebar
window.addEventListener('hashchange', handleRoute);
// Se ejecuta al cargar la app por primera vez
window.addEventListener('load', handleRoute);
