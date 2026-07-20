import { registerRoute, navigateTo } from './router.js';
import { getSessionUser, initHeader } from './components/header.js';
import { buildSidebar, initSidebarCollapse } from './components/sidebar.js';
import { getTutors, getSessions, getSessionById, createSession, updateSession, deleteSession } from './services/mentoring.js';
import { formatDate } from './utils.js';
const SESSION_WRITES_ENABLED = false;

export function initApp(user) {
  registerAllRoutes(user.rol);
  buildSidebar(user.rol, user);
  initHeader(user);
  initSidebarCollapse();
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

export function renderDashboard() {
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

export function renderMentoring() {
  const user = getSessionUser();
  const canCreate =
  SESSION_WRITES_ENABLED &&
  user &&
  (
    user.rol === 'TL' ||
    user.rol === 'TUTOR' ||
    user.rol === 'ADMIN'
  );
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Mentorías</h2>
        <p class="page-header__subtitle">Gestiona todas las mentorías del programa.</p>
      </div>
      ${canCreate ? `<button class="btn btn-primary" id="btn-nueva-mentoria">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva Mentoría
      </button>` : ''}
    </div>
    <div class="filters-bar">
      <div class="search-bar">
        <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-bar__input" id="search-mentoring" placeholder="Buscar mentoría..." aria-label="Buscar mentoría" />
      </div>
      <select class="filters-bar__select" id="filter-estado" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option value="programada">Programada</option>
        <option value="en-progreso">En progreso</option>
        <option value="completada">Completada</option>
        <option value="cancelada">Cancelada</option>
      </select>
      <select class="filters-bar__select" id="filter-modalidad" aria-label="Filtrar por modalidad">
        <option value="">Toda modalidad</option>
        <option value="virtual">Virtual</option>
        <option value="presencial">Presencial</option>
      </select>
      <div class="filters-bar__spacer"></div>
      <div class="view-toggle" role="group" aria-label="Cambiar vista">
        <button class="view-toggle__btn active" id="view-grid" aria-label="Vista en grilla" aria-pressed="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
        <button class="view-toggle__btn" id="view-list" aria-label="Vista en lista" aria-pressed="false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="mentoring-grid" id="mentoring-container">
  <div class="empty-state">
    <h2 class="empty-state__title">
      Cargando mentorías...
    </h2>
    <p class="empty-state__description">
      Consultando las sesiones disponibles.
    </p>
  </div>
</div>
${getModalMentoring(canCreate)}
  `;
}

export function renderObservations() {
  const user = getSessionUser();
  const canAdd = user && (user.rol === 'TL' || user.rol === 'TUTOR' || user.rol === 'ADMIN');
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Observaciones</h2>
        <p class="page-header__subtitle">Registro del progreso de los coders.</p>
      </div>
      ${canAdd ? `<button class="btn btn-primary" id="btn-nueva-obs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva Observación
      </button>` : ''}
    </div>
    <div class="content-grid">
      <div>
        <div class="filters-bar" style="margin-bottom:var(--space-5);">
          <div class="search-bar">
            <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" class="search-bar__input" id="search-obs" placeholder="Buscar coder..." aria-label="Buscar observación" />
          </div>
          <select class="filters-bar__select" aria-label="Filtrar por tipo">
            <option value="">Todos los tipos</option>
            <option value="positiva">Positiva</option>
            <option value="mejora">A mejorar</option>
          </select>
        </div>
        <div class="timeline" id="observations-timeline">
          ${getObservationsTimeline()}
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card__header"><h3 class="card__title">Coders seguidos</h3></div>
          <div class="card__body" style="padding:var(--space-3);">${getCodersList()}</div>
        </div>
      </div>
    </div>
    ${getModalObservation(canAdd)}
  `;
}

export function renderFeedback() {
  const user = getSessionUser();
  const isCoder = user && user.rol === 'CODER';
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Feedback</h2>
        <p class="page-header__subtitle">Retroalimentación de los coders sobre las mentorías realizadas.</p>
      </div>
      ${isCoder ? `<button class="btn btn-primary" id="btn-nuevo-feedback">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Dar Feedback
      </button>` : ''}
    </div>
    <div class="stats-grid" style="margin-bottom:var(--space-6);">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Total feedbacks</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0.0</div>
          <div class="stat-card__label">Calificación promedio</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Sin responder</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Historial de feedback</h3>
        <div class="search-bar">
          <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" class="search-bar__input" placeholder="Buscar..." aria-label="Buscar feedback" />
        </div>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h4 class="empty-state__title">Sin feedbacks aún</h4>
          <p class="empty-state__description">Cuando los coders califiquen sus mentorías, aparecerán aquí.</p>
        </div>
      </div>
    </div>
    ${getModalFeedback(isCoder)}
  `;
}

export function renderUsers() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Usuarios</h2>
        <p class="page-header__subtitle">Gestión de usuarios del sistema TutorLink.</p>
      </div>
    </div>
    <div class="filters-bar">
      <div class="search-bar">
        <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-bar__input" placeholder="Buscar usuario..." aria-label="Buscar usuario" />
      </div>
      <select class="filters-bar__select" aria-label="Filtrar por rol">
        <option value="">Todos los roles</option>
        <option value="CODER">Coder</option>
        <option value="TUTOR">Tutor</option>
        <option value="TL">Team Leader</option>
      </select>
      <select class="filters-bar__select" aria-label="Filtrar por estado">
        <option value="">Todos</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>
    <div class="card">
      <div class="table-container">
        <table class="table" aria-label="Tabla de usuarios">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Email</th>
              <th scope="col">Rol</th>
              <th scope="col">Clan</th>
              <th scope="col">Estado</th>
              <th scope="col">Registro</th>
              <th scope="col"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            <tr>
              <td colspan="7">
                <div class="empty-state" style="padding:var(--space-8);">
                  <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h4 class="empty-state__title">Sin usuarios</h4>
                  <p class="empty-state__description">Los usuarios se cargarán desde el backend en el Sprint 4.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderMyCoders() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Mis Coders</h2>
        <p class="page-header__subtitle">Coders asignados a tu seguimiento.</p>
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Con buen progreso</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Requieren atención</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Listado de coders</h3>
        <div class="search-bar">
          <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" class="search-bar__input" placeholder="Buscar coder..." aria-label="Buscar coder" />
        </div>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">Sin coders asignados</h4>
          <p class="empty-state__description">Los coders se asignarán desde el backend en el Sprint 4.</p>
        </div>
      </div>
    </div>
  `;
}

export function renderMetrics() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Métricas</h2>
        <p class="page-header__subtitle">Indicadores de rendimiento del programa de mentorías.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Total mentorías</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0%</div>
          <div class="stat-card__label">Tasa de completitud</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0.0</div>
          <div class="stat-card__label">Calificación promedio</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Coders activos</div>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header"><h3 class="card__title">Mentorías por estado</h3></div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:var(--space-4);">
            ${['Completadas','Programadas','En progreso','Canceladas'].map((l,i) => `
              <div>
                <div class="flex justify-between text-sm" style="margin-bottom:6px;">
                  <span style="color:var(--color-text-secondary);">${l}</span>
                  <span style="font-weight:600;">0</span>
                </div>
                <div class="progress-bar"><div class="progress-bar__fill" style="width:0%;"></div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card__header"><h3 class="card__title">Distribución por modalidad</h3></div>
        <div class="card__body">
          <div class="empty-state" style="padding:var(--space-6);">
            <p class="empty-state__description">Los datos reales vendrán del backend en el Sprint 4.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderSettings() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Configuración</h2>
        <p class="page-header__subtitle">Ajustes del sistema TutorLink.</p>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header"><h3 class="card__title">Perfil del sistema</h3></div>
        <div class="card__body">
          <div class="form-group">
            <label class="form-label">Nombre de la plataforma</label>
            <input type="text" class="form-input" value="TutorLink" />
          </div>
          <div class="form-group">
            <label class="form-label">Organización</label>
            <input type="text" class="form-input" value="RIWI Academy" />
          </div>
          <button class="btn btn-primary">Guardar cambios</button>
        </div>
      </div>
      <div class="card">
        <div class="card__header"><h3 class="card__title">Estado del sistema</h3></div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:var(--space-4);">
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Backend API</span>
              <span class="badge badge--pending">Sin conectar</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Base de datos</span>
              <span class="badge badge--pending">Sin conectar</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Firebase Auth</span>
              <span class="badge badge--pending">Sin conectar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// HELPERS — Generadores de HTML para cada sección
// Sprint 4: estas funciones usarán datos reales del backend
// ============================================================

/**
 * Genera las cards de mentorías.
 * Los datos vienen del servicio (js/services/mentoring.js).
 * Sprint 4: el servicio hará fetch al backend con las mismas firmas.
 * @param {Array} [list] - Lista ya filtrada; si no se pasa, se cargan todas.
 */
export function getMentoringCards(list) {
  const sample = list || getSessions();

  if (!sample.length) {
    return `
      <div class="empty-state">
        <h2 class="empty-state__title">Sin mentorías</h2>
        <p class="empty-state__description">No hay mentorías que coincidan. Crea una con "Nueva Mentoría".</p>
      </div>
    `;
  }

  return sample.map(m => `
    <article class="mentoring-detail-card" aria-label="Mentoría: ${m.topic}">
      <div class="mentoring-detail-card__top">
        <div class="mentoring-detail-card__header">
          <h3 class="mentoring-detail-card__topic">${m.topic}</h3>
          <div class="flex gap-2 items-center">
            <span class="badge badge--${m.status}">${m.status}</span>
            ${SESSION_WRITES_ENABLED ? `
                <div class="action-menu">
                  <button
                    class="action-menu__trigger"
                    aria-label="Acciones para ${m.topic}"
                    aria-haspopup="true"
                    onclick="toggleActionMenu(this, ${m.id})"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              ` : ''}
          </div>
        </div>
        <p class="mentoring-detail-card__desc">${m.desc}</p>
        <div class="mentoring-detail-card__info">
          <div class="mentoring-detail-card__info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>${m.tutor}</span>
          </div>
          <div class="mentoring-detail-card__info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${formatDate(m.date)} · ${m.time}</span>
          </div>
          <div class="mentoring-detail-card__info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="mentoring-type mentoring-type--${m.modality}">${m.modality === 'virtual' ? '🔗 Virtual' : '📍 Presencial'}</span>
          </div>
          <div class="mentoring-detail-card__info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>
              ${m.participantCount ?? m.coders.length}
              participante${(m.participantCount ?? m.coders.length) !== 1 ? 's' : ''}
            </span>
        </div>
        </div>
      </div>
      <div class="mentoring-detail-card__bottom">
        <div class="participant-avatars" aria-label="Participantes">
          ${m.coders.slice(0,3).map(c => `<div class="participant-avatars__item" title="${c}">${c}</div>`).join('')}
          ${m.coders.length > 3 ? `<div class="participant-avatars__item participant-avatars__item--more">+${m.coders.length - 3}</div>` : ''}
        </div>
        ${m.status === 'completada'
          ? `<button class="btn btn-sm btn-secondary" onclick="navigateTo('/feedback')">Ver feedback</button>`
          : m.status === 'programada'
          ? `<button class="btn btn-sm btn-primary" onclick="alert('Unirse a la mentoría')">Unirse</button>`
          : m.status === 'cancelada'
          ? `<span class="text-sm text-muted">Mentoría cancelada</span>`
          : `<span class="text-sm text-muted">En curso</span>`
        }
      </div>
    </article>
  `).join('');
}

/** Genera el modal de crear/editar mentoría */
function getModalMentoring(canCreate) {
  if (!canCreate) return '';
  return `
    <div class="modal-overlay" id="modal-mentoring" role="dialog" aria-modal="true" aria-labelledby="modal-mentoring-title">
      <div class="modal modal--lg">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-mentoring-title">Nueva Mentoría</h2>
          <button class="modal__close" onclick="closeModal('modal-mentoring')" aria-label="Cerrar modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-mentoring" novalidate>
            <!-- id oculto: vacío = crear, con valor = editar -->
            <input type="hidden" id="m-id" value="" />
            <div class="form-grid">
              <div class="form-group">
                <label for="m-topic" class="form-label form-label--required">Temática</label>
                <input type="text" id="m-topic" class="form-input" placeholder="Ej: JavaScript Avanzado" required />
                <span class="form-error hidden" id="m-topic-error">Ingresa la temática.</span>
              </div>
              <div class="form-group">
                <label for="m-tutor" class="form-label form-label--required">Tutor</label>
                <select id="m-tutor" class="form-select" required>
                  <option value="">Seleccionar tutor...</option>
                  ${getTutors().map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
                <span class="form-error hidden" id="m-tutor-error">Selecciona un tutor.</span>
              </div>
              <div class="form-group">
                <label for="m-date" class="form-label form-label--required">Fecha</label>
                <input type="date" id="m-date" class="form-input" required />
                <span class="form-error hidden" id="m-date-error">Selecciona una fecha.</span>
              </div>
              <div class="form-group">
                <label for="m-time" class="form-label form-label--required">Hora</label>
                <input type="time" id="m-time" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="m-modality" class="form-label form-label--required">Modalidad</label>
                <select id="m-modality" class="form-select" required onchange="toggleModalityField()">
                  <option value="">Seleccionar...</option>
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>
              <div class="form-group" id="m-location-group">
                <label for="m-location" class="form-label" id="m-location-label">Enlace / Sala</label>
                <input type="text" id="m-location" class="form-input" placeholder="meet.google.com/..." />
              </div>
              <div class="form-group">
                <label for="m-type" class="form-label">Tipo</label>
                <select id="m-type" class="form-select">
                  <option value="abierta">Abierta (todos los clanes)</option>
                  <option value="cerrada">Cerrada (mismo clan)</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="m-desc" class="form-label">Descripción</label>
              <textarea id="m-desc" class="form-textarea" placeholder="Describe el contenido de la mentoría..." rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-mentoring')">Cancelar</button>
          <button class="btn btn-primary" id="m-submit-btn" onclick="submitMentoring()">Crear Mentoría</button>
        </div>
      </div>
    </div>
  `;
}

/** Genera el timeline de observaciones de muestra */
function getObservationsTimeline() {
  const sample = [
    { type:'blue', author:'María Torres (TL)', initials:'MT', date:'10 Jul 2026', target:'Kevin Mendoza', text:'Excelente progreso en JavaScript. Kevin demuestra comprensión sólida de closures y es capaz de explicarlos con ejemplos propios.' },
    { type:'green', author:'Carlos López (Tutor)', initials:'CL', date:'8 Jul 2026', target:'Kevin Mendoza', text:'Participación activa en la mentoría de bases de datos. Se recomienda reforzar el concepto de normalización.' },
    { type:'orange', author:'María Torres (TL)', initials:'MT', date:'5 Jul 2026', target:'Juan Pérez', text:'Se solicita al coder mayor compromiso con los horarios establecidos. Esta es la segunda vez que llega tarde a la mentoría.' },
  ];

  return sample.map(o => `
    <div class="timeline-item timeline-item--${o.type}">
      <div class="timeline-item__card">
        <div class="timeline-item__header">
          <div class="timeline-item__author">
            <div class="timeline-item__avatar">${o.initials}</div>
            <div>
              <div class="timeline-item__author-name">${o.author}</div>
              <div class="timeline-item__date">${o.date}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm btn-icon" aria-label="Editar observación">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
        <p class="timeline-item__text">${o.text}</p>
        <span class="timeline-item__target">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${o.target}
        </span>
      </div>
    </div>
  `).join('');
}

/** Genera la lista de coders en el sidebar de observaciones */
function getCodersList() {
  const coders = [
    { name:'Kevin Mendoza', clan:'Alpha', obs: 2 },
    { name:'Juan Pérez', clan:'Beta', obs: 1 },
    { name:'Laura Castro', clan:'Alpha', obs: 3 },
  ];
  return coders.map(c => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);border-radius:var(--radius-md);cursor:pointer;transition:background-color 150ms;"
      onmouseenter="this.style.backgroundColor='var(--color-bg)'"
      onmouseleave="this.style.backgroundColor='transparent'">
      <div style="display:flex;align-items:center;gap:var(--space-2);">
        <div class="table__user-avatar">${c.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div>
          <div style="font-size:var(--font-size-sm);font-weight:600;">${c.name}</div>
          <div style="font-size:var(--font-size-xs);color:var(--color-text-muted);">Clan ${c.clan}</div>
        </div>
      </div>
      <span class="badge badge--info">${c.obs}</span>
    </div>
  `).join('');
}

/** Modal de nueva observación */
function getModalObservation(canAdd) {
  if (!canAdd) return '';
  return `
    <div class="modal-overlay" id="modal-observation" role="dialog" aria-modal="true" aria-labelledby="modal-obs-title">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-obs-title">Nueva Observación</h2>
          <button class="modal__close" onclick="closeModal('modal-observation')" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-observation" novalidate>
            <div class="form-group">
              <label for="obs-target" class="form-label form-label--required">Coder / Tutor observado</label>
              <select id="obs-target" class="form-select" required>
                <option value="">Seleccionar persona...</option>
                <option value="1">Kevin Mendoza (Coder)</option>
                <option value="2">Juan Pérez (Coder)</option>
                <option value="3">Ana García (Tutor)</option>
              </select>
              <span class="form-error hidden" id="obs-target-error">Selecciona a quien va dirigida la observación.</span>
            </div>
            <div class="form-group">
              <label for="obs-type" class="form-label">Tipo</label>
              <select id="obs-type" class="form-select">
                <option value="positiva">✅ Positiva</option>
                <option value="mejora">⚠️ A mejorar</option>
                <option value="critica">🔴 Crítica</option>
              </select>
            </div>
            <div class="form-group">
              <label for="obs-text" class="form-label form-label--required">Observación</label>
              <textarea id="obs-text" class="form-textarea" placeholder="Describe la observación o recomendación..." rows="4" required></textarea>
              <span class="form-error hidden" id="obs-text-error">La observación no puede estar vacía.</span>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-observation')">Cancelar</button>
          <button class="btn btn-primary" onclick="submitObservation()">Guardar</button>
        </div>
      </div>
    </div>
  `;
}

/** Modal de feedback del coder */
function getModalFeedback(isCoder) {
  if (!isCoder) return '';
  return `
    <div class="modal-overlay" id="modal-feedback" role="dialog" aria-modal="true" aria-labelledby="modal-fb-title">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-fb-title">Dar Feedback</h2>
          <button class="modal__close" onclick="closeModal('modal-feedback')" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-feedback" novalidate>
            <div class="form-group">
              <label for="fb-mentoring" class="form-label form-label--required">Mentoría</label>
              <select id="fb-mentoring" class="form-select" required>
                <option value="">Seleccionar mentoría completada...</option>
                <option value="1">JavaScript Avanzado — 15 Jul 2026</option>
                <option value="2">Bases de Datos SQL — 16 Jul 2026</option>
              </select>
              <span class="form-error hidden" id="fb-mentoring-error">Selecciona la mentoría.</span>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Calificación</label>
              <div class="star-rating" id="star-rating" role="group" aria-label="Califica de 1 a 5 estrellas">
                ${[1,2,3,4,5].map(n => `
                  <svg class="star-rating__star" data-value="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    tabindex="0" role="radio" aria-label="${n} estrella${n>1?'s':''}" aria-checked="false"
                    onclick="setRating(${n})" onkeydown="if(event.key==='Enter'||event.key===' '){setRating(${n})}">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>`).join('')}
              </div>
              <input type="hidden" id="fb-rating" value="0" />
              <span class="form-error hidden" id="fb-rating-error">Selecciona una calificación.</span>
            </div>
            <div class="form-group">
              <label for="fb-comment" class="form-label form-label--required">Comentario</label>
              <textarea id="fb-comment" class="form-textarea" placeholder="¿Qué te pareció la mentoría? ¿Qué mejorarías?" rows="4" required></textarea>
              <span class="form-error hidden" id="fb-comment-error">Escribe un comentario.</span>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-feedback')">Cancelar</button>
          <button class="btn btn-primary" onclick="submitFeedback()">Enviar Feedback</button>
        </div>
      </div>
    </div>
  `;
}
