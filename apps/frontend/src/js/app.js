import { registerRoute, navigateTo } from './router.js';
import { getSessionUser, initHeader } from './components/header.js';
import { buildSidebar, initSidebarCollapse } from './components/sidebar.js';
import { getTutors, getSessions, getSessionById, createSession, updateSession, deleteSession } from './services/mentoring.js';
import { formatDate } from './utils.js';

export function initApp(user) {
  registerAllRoutes(user.role);
  buildSidebar(user.role, user);
  initHeader(user);
  initSidebarCollapse();
}

/**
 * Registers all the application routes.
 * Each route points to a render function imported from js/pages/.
 * @param {string} role - Active user's role
 */
function registerAllRoutes(role) {
  // Common routes for all roles
  registerRoute('/dashboard',    'Dashboard',      renderDashboard);
  registerRoute('/mentoring',    'Mentoring sessions',      renderMentoring);
  registerRoute('/feedback',     'Feedback',       renderFeedback);
  registerRoute('/observations', 'Observations',  renderObservations);

  // Role-based routes
  if (role === 'TUTOR' || role === 'TL' || role === 'ADMIN') {
    registerRoute('/my-coders', 'My Coders', renderMyCoders);
  }

  if (role === 'TL' || role === 'ADMIN') {
    registerRoute('/users',   'Users', renderUsers);
    registerRoute('/metrics', 'Metrics', renderMetrics);
  }

  if (role === 'ADMIN') {
    registerRoute('/settings', 'Settings', renderSettings);
  }
}

// ---- PLACEHOLDER RENDER FUNCTIONS ----
// These functions return the HTML for each page.
// Sprint 2: will be replaced with complete, designed HTML.
// For now they just show that the route works.

export function renderDashboard() {
  const user = getSessionUser();
  const role = user?.role || 'CODER';

  // Different dashboard depending on role
  if (role === 'TL' || role === 'ADMIN') return renderDashboardTL(user);
  if (role === 'TUTOR') return renderDashboardTutor(user);
  return renderDashboardCoder(user);
}

function renderDashboardCoder(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">Hello, ${user?.name || 'Coder'}! 👋</h2>
        <p class="welcome-banner__subtitle">Welcome to TutorCode. Here you can manage your mentoring sessions.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Mentoring Sessions this month</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Completed</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Pending</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Upcoming Mentorships</h3>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h4 class="empty-state__title">No Upcoming Mentorships</h4>
          <p class="empty-state__description">When you have scheduled mentorships, they will appear here.</p>
          <button class="btn btn-primary" onclick="navigateTo('/mentoring')">View Mentorships</button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardTutor(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">Hello, ${user?.name || 'Tutor'}! 👋</h2>
        <p class="welcome-banner__subtitle">Manage your mentoring sessions and track your coders' progress.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Assigned Coders</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Active Mentorships</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Pending Feedbacks</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">My Coders</h3>
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('/my-coders')">View All</button>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <p class="empty-state__description">You don't have any assigned coders yet.</p>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardTL(user) {
  return `
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__greeting">Hello, ${user?.name || 'Team Leader'}! 👋</h2>
        <p class="welcome-banner__subtitle">Monitor your team's progress and program metrics.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Total Users</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Completed Mentorships</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Pending Mentorships</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0%</div>
          <div class="stat-card__label">Completion Rate</div>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Recent Mentorships</h3>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('/mentoring')">View All</button>
        </div>
        <div class="card__body">
          <div class="empty-state">
            <p class="empty-state__description">No recent mentorships.</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Recent Activity</h3>
        </div>
        <div class="card__body">
          <div class="empty-state">
            <p class="empty-state__description">No recent activity.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- PLACEHOLDER PAGES (fully developed in Sprint 2) ----

export function renderMentoring() {
  const user = getSessionUser();
  const canCreate = user && (user.role === 'TL' || user.role === 'TUTOR' || user.role === 'ADMIN');
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Mentorships</h2>
        <p class="page-header__subtitle">Manage all mentorships in the program.</p>
      </div>
      ${canCreate ? `<button class="btn btn-primary" id="btn-new-mentoring">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Mentorship
      </button>` : ''}
    </div>
    <div class="filters-bar">
      <div class="search-bar">
        <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-bar__input" id="search-mentoring" placeholder="Search mentorship..." aria-label="Search mentorship" />
      </div>
      <select class="filters-bar__select" id="filter-status" aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select class="filters-bar__select" id="filter-modality" aria-label="Filter by modality">
        <option value="">All modalities</option>
        <option value="virtual">Virtual</option>
        <option value="in-person">In-person</option>
      </select>
      <div class="filters-bar__spacer"></div>
      <div class="view-toggle" role="group" aria-label="Change view">
        <button class="view-toggle__btn active" id="view-grid" aria-label="Grid view" aria-pressed="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
        <button class="view-toggle__btn" id="view-list" aria-label="List view" aria-pressed="false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="mentoring-grid" id="mentoring-container">
      ${getMentoringCards()}
    </div>
    ${getModalMentoring(canCreate)}
  `;
}

export function renderObservations() {
  const user = getSessionUser();
  const canAdd = user && (user.role === 'TL' || user.role === 'TUTOR' || user.role === 'ADMIN');
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Observations</h2>
        <p class="page-header__subtitle">Record of the progress of the coders.</p>
      </div>
      ${canAdd ? `<button class="btn btn-primary" id="btn-new-observation">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Observation
      </button>` : ''}
    </div>
    <div class="content-grid">
      <div>
        <div class="filters-bar" style="margin-bottom:var(--space-5);">
          <div class="search-bar">
            <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" class="search-bar__input" id="search-obs" placeholder="Search coder..." aria-label="Search observation" />
          </div>
          <select class="filters-bar__select" aria-label="Filter by type">
            <option value="">All types</option>
            <option value="positive">Positive</option>
            <option value="improvement">To improve</option>
          </select>
        </div>
        <div class="timeline" id="observations-timeline">
          ${getObservationsTimeline()}
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card__header"><h3 class="card__title">Tracked Coders</h3></div>
          <div class="card__body" style="padding:var(--space-3);">${getCodersList()}</div>
        </div>
      </div>
    </div>
    ${getModalObservation(canAdd)}
  `;
}

export function renderFeedback() {
  const user = getSessionUser();
  const isCoder = user && user.role === 'CODER';
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Feedback</h2>
        <p class="page-header__subtitle">Feedback from coders about the mentorships sessions.</p>
      </div>
      ${isCoder ? `<button class="btn btn-primary" id="btn-new-feedback">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Give Feedback
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
          <div class="stat-card__label">Average Rating</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Unanswered</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Feedback History</h3>
        <div class="search-bar">
          <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" class="search-bar__input" placeholder="Search..." aria-label="Search feedback" />
        </div>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h4 class="empty-state__title">No feedbacks yet</h4>
          <p class="empty-state__description">When the coders rate their mentorships, they will appear here.</p>
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
        <h2 class="page-header__title">Users</h2>
        <p class="page-header__subtitle">Management of users in the TutorCode system.</p>
      </div>
    </div>
    <div class="filters-bar">
      <div class="search-bar">
        <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-bar__input" placeholder="Search user..." aria-label="Search user" />
      </div>
      <select class="filters-bar__select" aria-label="Filter by role">
        <option value="">All roles</option>
        <option value="CODER">Coder</option>
        <option value="TUTOR">Tutor</option>
        <option value="TL">Team Leader</option>
      </select>
      <select class="filters-bar__select" aria-label="Filter by status">
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
    <div class="card">
      <div class="table-container">
        <table class="table" aria-label="Users table">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Clan</th>
              <th scope="col">Status</th>
              <th scope="col">Registration</th>
              <th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            <tr>
              <td colspan="7">
                <div class="empty-state" style="padding:var(--space-8);">
                  <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h4 class="empty-state__title">No users found</h4>
                  <p class="empty-state__description">Users will be loaded from the backend in Sprint 4.</p>
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
        <h2 class="page-header__title">My Coders</h2>
        <p class="page-header__subtitle">Coders assigned to your supervision.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Coders assigned</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">With good progress</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Require attention</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">List of Coders</h3>
        <div class="search-bar">
          <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" class="search-bar__input" placeholder="Search coder..." aria-label="Search coder" />
        </div>
      </div>
      <div class="card__body">
        <div class="empty-state">
          <h4 class="empty-state__title">No coders assigned</h4>
          <p class="empty-state__description">Coders will be assigned from the backend in Sprint 4.</p>
        </div>
      </div>
    </div>
  `;
}

export function renderMetrics() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Metrics</h2>
        <p class="page-header__subtitle">Performance indicators of the mentoring program.</p>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Total mentorships</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0%</div>
          <div class="stat-card__label">Completion rate</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0.0</div>
          <div class="stat-card__label">Average rating</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Active coders</div>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header"><h3 class="card__title">Mentorships by status</h3></div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:var(--space-4);">
            ${['Completed','Scheduled','In Progress','Cancelled'].map((l,i) => `
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
        <div class="card__header"><h3 class="card__title">Distribution by modality</h3></div>
        <div class="card__body">
          <div class="empty-state" style="padding:var(--space-6);">
            <p class="empty-state__description">The real data will come from the backend in Sprint 4.</p>
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
        <h2 class="page-header__title">Settings</h2>
        <p class="page-header__subtitle">System configuration for TutorCode.</p>
      </div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card__header"><h3 class="card__title">System Profile</h3></div>
        <div class="card__body">
          <div class="form-group">
            <label class="form-label">Platform Name</label>
            <input type="text" class="form-input" value="TutorCode" />
          </div>
          <div class="form-group">
            <label class="form-label">Organization</label>
            <input type="text" class="form-input" value="RIWI Academy" />
          </div>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
      <div class="card">
        <div class="card__header"><h3 class="card__title">System Status</h3></div>
        <div class="card__body">
          <div style="display:flex;flex-direction:column;gap:var(--space-4);">
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Backend API</span>
              <span class="badge badge--pending">Not connected</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Database</span>
              <span class="badge badge--pending">Not connected</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size:var(--font-size-sm);">Firebase Auth</span>
              <span class="badge badge--pending">Not connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// HELPERS — HTML generators for each section
// Sprint 4: these functions will use real data from the backend
// ============================================================

/**
 * Generates the mentorship cards.
 * The data comes from the service (js/services/mentoring.js).
 * Sprint 4: the service will fetch from the backend with the same signatures.
 * @param {Array} [list] - Already-filtered list; if not passed, all are loaded.
 */
export function getMentoringCards(list) {
  const sample = list || getSessions();

  if (!sample.length) {
    return `
      <div class="empty-state">
        <h2 class="empty-state__title">Without mentorships</h2>
        <p class="empty-state__description">There are no mentorships that match your criteria. Create one with "New Mentorship".</p>
      </div>
    `;
  }

  return sample.map(m => `
    <article class="mentoring-detail-card" aria-label="Mentorship: ${m.topic}">
      <div class="mentoring-detail-card__top">
        <div class="mentoring-detail-card__header">
          <h3 class="mentoring-detail-card__topic">${m.topic}</h3>
          <div class="flex gap-2 items-center">
            <span class="badge badge--${m.status}">${m.status}</span>
            <div class="action-menu">
              <button class="action-menu__trigger" aria-label="Actions for ${m.topic}" aria-haspopup="true"
                onclick="toggleActionMenu(this, ${m.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </div>
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
            <span class="mentoring-type mentoring-type--${m.modality}">${m.modality === 'virtual' ? '🔗 Virtual' : '📍 In-person'}</span>
          </div>
          <div class="mentoring-detail-card__info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>${m.coders.length} participante${m.coders.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      <div class="mentoring-detail-card__bottom">
        <div class="participant-avatars" aria-label="Participants">
          ${m.coders.slice(0,3).map(c => `<div class="participant-avatars__item" title="${c}">${c}</div>`).join('')}
          ${m.coders.length > 3 ? `<div class="participant-avatars__item participant-avatars__item--more">+${m.coders.length - 3}</div>` : ''}
        </div>
        ${m.status === 'completed'
          ? `<button class="btn btn-sm btn-secondary" onclick="navigateTo('/feedback')">View feedback</button>`
          : m.status === 'scheduled'
          ? `<button class="btn btn-sm btn-primary" onclick="alert('Join the mentorship')">Join</button>`
          : `<span class="text-sm text-muted">In progress</span>`
        }
      </div>
    </article>
  `).join('');
}

/** Generates the create/edit mentorship modal */
function getModalMentoring(canCreate) {
  if (!canCreate) return '';
  return `
    <div class="modal-overlay" id="modal-mentoring" role="dialog" aria-modal="true" aria-labelledby="modal-mentoring-title">
      <div class="modal modal--lg">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-mentoring-title">New Mentorship</h2>
          <button class="modal__close" onclick="closeModal('modal-mentoring')" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-mentoring" novalidate>
            <!-- hidden id: empty = create, with value = edit -->
            <input type="hidden" id="m-id" value="" />
            <div class="form-grid">
              <div class="form-group">
                <label for="m-topic" class="form-label form-label--required">Topic</label>
                <input type="text" id="m-topic" class="form-input" placeholder="Ej: JavaScript Advanced" required />
                <span class="form-error hidden" id="m-topic-error">Enter the topic.</span>
              </div>
              <div class="form-group">
                <label for="m-tutor" class="form-label form-label--required">Tutor</label>
                <select id="m-tutor" class="form-select" required>
                  <option value="">Select tutor...</option>
                  ${getTutors().map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
                <span class="form-error hidden" id="m-tutor-error">Select a tutor.</span>
              </div>
              <div class="form-group">
                <label for="m-date" class="form-label form-label--required">Date</label>
                <input type="date" id="m-date" class="form-input" required />
                <span class="form-error hidden" id="m-date-error">Select a date.</span>
              </div>
              <div class="form-group">
                <label for="m-time" class="form-label form-label--required">Time</label>
                <input type="time" id="m-time" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="m-modality" class="form-label form-label--required">Modality</label>
                <select id="m-modality" class="form-select" required onchange="toggleModalityField()">
                  <option value="">Select...</option>
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-person</option>
                </select>
              </div>
              <div class="form-group" id="m-location-group">
                <label for="m-location" class="form-label" id="m-location-label">Link / Room</label>
                <input type="text" id="m-location" class="form-input" placeholder="meet.google.com/..." />
              </div>
              <div class="form-group">
                <label for="m-type" class="form-label">Type</label>
                <select id="m-type" class="form-select">
                  <option value="open">Open (all clans)</option>
                  <option value="closed">Closed (same clan)</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="m-desc" class="form-label">Description</label>
              <textarea id="m-desc" class="form-textarea" placeholder="Describe the content of the mentoring session..." rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-mentoring')">Cancel</button>
          <button class="btn btn-primary" id="m-submit-btn" onclick="submitMentoring()">Create Mentorship</button>
        </div>
      </div>
    </div>
  `;
}

/** Generates the sample observations timeline */
function getObservationsTimeline() {
  const sample = [
    { type:'blue', author:'María Torres (TL)', initials:'MT', date:'10 Jul 2026', target:'Kevin Mendoza', text:'Excellent progress in JavaScript. Kevin shows a solid understanding of closures and can explain them with his own examples.' },
    { type:'green', author:'Carlos López (Tutor)', initials:'CL', date:'8 Jul 2026', target:'Kevin Mendoza', text:'Active participation in the database mentoring session. Recommended to reinforce the concept of normalization.' },
    { type:'orange', author:'María Torres (TL)', initials:'MT', date:'5 Jul 2026', target:'Juan Pérez', text:'The coder is asked to show greater commitment to the set schedule. This is the second time they have arrived late to the mentoring session.' },
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
          <button class="btn btn-ghost btn-sm btn-icon" aria-label="Edit observation">
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

/** Generates the coder list in the observations sidebar */
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

/** New observation modal */
function getModalObservation(canAdd) {
  if (!canAdd) return '';
  return `
    <div class="modal-overlay" id="modal-observation" role="dialog" aria-modal="true" aria-labelledby="modal-obs-title">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-obs-title">New Observation</h2>
          <button class="modal__close" onclick="closeModal('modal-observation')" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-observation" novalidate>
            <div class="form-group">
              <label for="obs-target" class="form-label form-label--required">Coder / Tutor observed</label>
              <select id="obs-target" class="form-select" required>
                <option value="">Select person...</option>
                <option value="1">Kevin Mendoza (Coder)</option>
                <option value="2">Juan Pérez (Coder)</option>
                <option value="3">Ana García (Tutor)</option>
              </select>
              <span class="form-error hidden" id="obs-target-error">Select the person this observation is directed to.</span>
            </div>
            <div class="form-group">
              <label for="obs-type" class="form-label">Type</label>
              <select id="obs-type" class="form-select">
                <option value="positive">✅ Positive</option>
                <option value="improvement">⚠️ To improve</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
            <div class="form-group">
              <label for="obs-text" class="form-label form-label--required">Observation</label>
              <textarea id="obs-text" class="form-textarea" placeholder="Describe the observation or recommendation..." rows="4" required></textarea>
              <span class="form-error hidden" id="obs-text-error">The observation cannot be empty.</span>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-observation')">Cancel</button>
          <button class="btn btn-primary" onclick="submitObservation()">Save</button>
        </div>
      </div>
    </div>
  `;
}

/** Coder feedback modal */
function getModalFeedback(isCoder) {
  if (!isCoder) return '';
  return `
    <div class="modal-overlay" id="modal-feedback" role="dialog" aria-modal="true" aria-labelledby="modal-fb-title">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-fb-title">Provide Feedback</h2>
          <button class="modal__close" onclick="closeModal('modal-feedback')" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <form id="form-feedback" novalidate>
            <div class="form-group">
              <label for="fb-mentoring" class="form-label form-label--required">Mentorship</label>
              <select id="fb-mentoring" class="form-select" required>
                <option value="">Select completed mentorship...</option>
                <option value="1">Advanced JavaScript — 15 Jul 2026</option>
                <option value="2">SQL Databases — 16 Jul 2026</option>
              </select>
              <span class="form-error hidden" id="fb-mentoring-error">Select the mentorship.</span>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Rating</label>
              <div class="star-rating" id="star-rating" role="group" aria-label="Rate from 1 to 5 stars">
                ${[1,2,3,4,5].map(n => `
                  <svg class="star-rating__star" data-value="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    tabindex="0" role="radio" aria-label="${n} star${n>1?'s':''}" aria-checked="false"
                    onclick="setRating(${n})" onkeydown="if(event.key==='Enter'||event.key===' '){setRating(${n})}">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>`).join('')}
              </div>
              <input type="hidden" id="fb-rating" value="0" />
              <span class="form-error hidden" id="fb-rating-error">Select a rating.</span>
            </div>
            <div class="form-group">
              <label for="fb-comment" class="form-label form-label--required">Comment</label>
              <textarea id="fb-comment" class="form-textarea" placeholder="What did you think of the mentorship? What would you improve?" rows="4" required></textarea>
              <span class="form-error hidden" id="fb-comment-error">Write a comment.</span>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-feedback')">Cancel</button>
          <button class="btn btn-primary" onclick="submitFeedback()">Submit Feedback</button>
        </div>
      </div>
    </div>
  `;
}
