import { getSessionUser } from './components/header.js'

const routes = {};

export function registerRoute(path, title, render) {
  routes[path] = { title, render };
}

export function navigateTo(path) {
  history.pushState(null, '', path);
  handleRoute();
}

export function handleRoute() {
  const path = window.location.pathname;
  const isAuth = !!(getSessionUser() && sessionStorage.getItem('tutorcode_token'));

  if (!isAuth && path !== '/login') {
    if (routes['/login']) {
      navigateTo('/login');
    }
    return;
  }

  if (isAuth && path === '/login') {
    if (routes['/dashboard']) {
      navigateTo('/dashboard');
    }
    return;
  }

  if (path === '/login') {
    document.body.classList.remove('route-app');
    document.body.classList.add('route-login');
  } else {
    document.body.classList.remove('route-login');
    document.body.classList.add('route-app');
  }

  const route = routes[path];
  const pageContent = document.getElementById('page-content');
  const pageTitle = document.getElementById('header-page-title');

  if (!pageContent) return;

  if (route) {
    if (pageTitle) pageTitle.textContent = route.title;
    document.title = `TutorCode — ${route.title}`;
    pageContent.innerHTML = route.render();
    updateSidebarActive(path);
    initPageScript(path);
  } else {
    const notFound = render404();
    if (pageTitle) pageTitle.textContent = 'Page not found';
    document.title = 'TutorCode — 404';
    pageContent.innerHTML = notFound;
  }
}

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

function initPageScript(path) {
  const pageInits = {
    '/login': typeof initLogin === 'function' ? initLogin : null,
    '/dashboard': typeof initDashboard === 'function' ? initDashboard : null,
    '/mentoring': typeof initMentoring === 'function' ? initMentoring : null,
    '/observations': typeof initObservations === 'function' ? initObservations : null,
    '/feedback': typeof initFeedback === 'function' ? initFeedback : null,
  };

  const init = pageInits[path];
  if (init) {
    setTimeout(init, 0);
  }
}

export function render404() {
  return `
    <div class="empty-state">
      <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2 class="empty-state__title">Page not found</h2>
      <p class="empty-state__description">
        The route you are looking for does not exist in TutorCode.
      </p>
      <button class="btn btn-primary" onclick="navigateTo('/dashboard')">
        Go to Dashboard
      </button>
    </div>
  `;
}

window.addEventListener('popstate', handleRoute);
