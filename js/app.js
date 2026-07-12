/**
 * app.js — Punto de entrada principal de TutorLink SPA
 *
 * ¿Qué hace?
 * 1. Verifica si el usuario tiene sesión activa
 * 2. Carga el sidebar según el rol del usuario
 * 3. Inicializa el header
 * 4. Registra todas las rutas de la aplicación
 * 5. Arranca el router
 *
 * ¿Por qué aquí?
 * Este es el archivo que se carga último en app.html.
 * Cuando se ejecuta, ya existen router.js, sidebar.js y header.js.
 *
 * Kevin Mendoza | Frontend Developer
 */

// ---- USUARIO DE PRUEBA PARA DESARROLLO ----
// TODO Sprint 4: reemplazar con autenticación Firebase real
// Este objeto simula lo que devolvería el backend después del login
const DEV_USER = {
  nombre:   'Kevin',
  apellido: 'Mendoza',
  email:    'kevin@riwi.io',
  rol:      'TL',         // Cambia a: CODER, TUTOR, TL, ADMIN para probar
  clan:     'Alpha',
};

/**
 * Inicializa la aplicación principal.
 * Se ejecuta cuando el DOM está listo.
 */
function initApp() {
  // 1. Obtener usuario (de sesión o usar usuario de dev)
  let user = getSessionUser();

  // En desarrollo usamos el usuario de prueba
  // Sprint 4: esto será validado contra Firebase + backend
  if (!user) {
    user = DEV_USER;
    // Guardamos en sessionStorage para que los componentes lo lean
    sessionStorage.setItem('tutorlink_user', JSON.stringify(user));
  }

  // 2. Registrar todas las rutas
  registerAllRoutes(user.rol);

  // 3. Construir el sidebar según el rol
  buildSidebar(user.rol, user);

  // 4. Inicializar el header
  initHeader(user);

  // 5. Inicializar colapso del sidebar
  initSidebarCollapse();

  // 6. El router ya escucha eventos load y hashchange
  // (está definido en router.js, no necesitamos llamarlo aquí)
}

/**
 * Registra todas las rutas de la aplicación.
 * Cada ruta apunta a una función de render importada de js/pages/.
 * @param {string} role - Rol del usuario activo
 */
function registerAllRoutes(role) {
  // Rutas comunes para todos los roles
  registerRoute('/dashboard',    'Dashboard',      renderDashboard);
  registerRoute('/mentoring',    'Mentorías',      renderMentoring);
  registerRoute('/feedback',     'Feedback',       renderFeedback);
  registerRoute('/observations', 'Observaciones',  renderObservations);

  // Rutas según rol
  if (role === 'TUTOR' || role === 'TL' || role === 'ADMIN') {
    registerRoute('/my-coders', 'Mis Coders', renderMyCoders);
  }

  if (role === 'TL' || role === 'ADMIN') {
    registerRoute('/users',   'Usuarios', renderUsers);
    registerRoute('/metrics', 'Métricas', renderMetrics);
  }

  if (role === 'ADMIN') {
    registerRoute('/settings', 'Configuración', renderSettings);
  }
}

// ---- FUNCIONES RENDER PLACEHOLDER ----
// Estas funciones devuelven el HTML de cada página.
// Sprint 2: serán reemplazadas por HTML completo con diseño.
// Por ahora solo muestran que la ruta funciona.

function renderDashboard() {
  const user = getSessionUser();
  const role = user?.rol || 'CODER';

  // Dashboard diferente según rol
  if (role === 'TL' || role === 'ADMIN') return renderDashboardTL(user);
  if (role === 'TUTOR') return renderDashboardTutor(user);
  return renderDashboardCoder(user);
}

function renderDashboardCoder(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">¡Hola, ${user?.nombre || 'Coder'}! 👋</h2>
        <p class="welcome-banner__subtitle">Bienvenido a TutorLink. Aquí puedes gestionar tus mentorías.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Mentorías este mes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Completadas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Pendientes</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Próximas Mentorías</h3>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h4 class="empty-state__title">Sin mentorías programadas</h4>
          <p class="empty-state__description">Cuando tengas mentorías asignadas, aparecerán aquí.</p>
          <button class="btn btn-primary" onclick="navigateTo('/mentoring')">Ver Mentorías</button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardTutor(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">¡Hola, ${user?.nombre || 'Tutor'}! 👋</h2>
        <p class="welcome-banner__subtitle">Gestiona tus mentorías y el progreso de tus coders.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Coders asignados</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Mentorías activas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Feedbacks pendientes</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Mis Coders</h3>
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('/my-coders')">Ver todos</button>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <p class="empty-state__description">No tienes coders asignados aún.</p>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardTL(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">¡Hola, ${user?.nombre || 'Team Leader'}! 👋</h2>
        <p class="welcome-banner__subtitle">Supervisa el progreso del equipo y las métricas del programa.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Total usuarios</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Mentorías completadas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Mentorías pendientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0%</div>
          <div class="stat-card__label">Tasa de completitud</div>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Mentorías Recientes</h3>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('/mentoring')">Ver todas</button>
        </div>
        <div class="card__body">
          <div class="empty-state">
            <p class="empty-state__description">No hay mentorías registradas aún.</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Actividad Reciente</h3>
        </div>
        <div class="card__body">
          <div class="empty-state">
            <p class="empty-state__description">Sin actividad reciente.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- PÁGINAS PLACEHOLDER (Sprint 2 las desarrolla completas) ----

function renderMentoring() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Mentorías</h2>
        <p class="page-header__subtitle">Gestiona todas las mentorías del programa.</p>
      </div>
      <button class="btn btn-primary" onclick="alert('Modal crear mentoría — Sprint 3')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva Mentoría
      </button>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h4 class="empty-state__title">Sin mentorías</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderObservations() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Observaciones</h2>
        <p class="page-header__subtitle">Registra el progreso de los coders.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin observaciones</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderFeedback() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Feedback</h2>
        <p class="page-header__subtitle">Retroalimentación sobre las mentorías.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin feedback</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderUsers() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Usuarios</h2>
        <p class="page-header__subtitle">Gestión de usuarios del sistema.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin usuarios</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderMyCoders() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Mis Coders</h2>
        <p class="page-header__subtitle">Coders asignados a ti.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin coders asignados</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderMetrics() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Métricas</h2>
        <p class="page-header__subtitle">Indicadores del programa de mentorías.</p>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin datos aún</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Configuración</h2>
      </div>
    </div>
    <div class="card">
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Configuración</h4>
          <p class="empty-state__description">Esta vista se completa en el Sprint 2.</p>
        </div>
      </div>
    </div>
  `;
}

// ---- ARRANCAR LA APP ----
// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);
