const SIDEBAR_MENUS = {
  CODER: [
    {
      section: 'Principal',
      items: [
        { icon: 'home',     label: 'Dashboard',      route: '/dashboard' },
        { icon: 'calendar', label: 'Mis Mentorías',  route: '/mentoring' },
        { icon: 'message',  label: 'Feedback',       route: '/feedback' },
      ]
    }
  ],
  TUTOR: [
    {
      section: 'Principal',
      items: [
        { icon: 'home',     label: 'Dashboard',        route: '/dashboard' },
        { icon: 'calendar', label: 'Mentorías',        route: '/mentoring' },
        { icon: 'users',    label: 'Mis Coders',       route: '/my-coders' },
        { icon: 'edit',     label: 'Observaciones',    route: '/observations' },
      ]
    }
  ],
  TL: [
    {
      section: 'Principal',
      items: [
        { icon: 'home',      label: 'Dashboard',        route: '/dashboard' },
      ]
    },
    {
      section: 'Gestión',
      items: [
        { icon: 'calendar',  label: 'Mentorías',        route: '/mentoring' },
        { icon: 'users',     label: 'Usuarios',         route: '/users' },
        { icon: 'edit',      label: 'Observaciones',    route: '/observations' },
        { icon: 'message',   label: 'Feedback',         route: '/feedback' },
      ]
    },
    {
      section: 'Reportes',
      items: [
        { icon: 'bar-chart', label: 'Métricas',         route: '/metrics' },
      ]
    }
  ],
  ADMIN: [
    {
      section: 'Principal',
      items: [
        { icon: 'home',      label: 'Dashboard',        route: '/dashboard' },
      ]
    },
    {
      section: 'Gestión',
      items: [
        { icon: 'calendar',  label: 'Mentorías',        route: '/mentoring' },
        { icon: 'users',     label: 'Usuarios',         route: '/users' },
        { icon: 'edit',      label: 'Observaciones',    route: '/observations' },
        { icon: 'message',   label: 'Feedback',         route: '/feedback' },
      ]
    },
    {
      section: 'Admin',
      items: [
        { icon: 'settings',  label: 'Configuración',    route: '/settings' },
        { icon: 'bar-chart', label: 'Métricas',         route: '/metrics' },
      ]
    }
  ]
};

function getIcon(name) {
  const icons = {
    home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    calendar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    edit: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    message: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    'bar-chart': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  };
  return icons[name] || icons['home'];
}

function buildNavItem(item, activeRoute) {
  const isActive = activeRoute === item.route;
  return `
    <button
      class="sidebar__nav-item ${isActive ? 'active' : ''}"
      data-route="${item.route}"
      onclick="navigateTo('${item.route}')"
      role="menuitem"
      ${isActive ? 'aria-current="page"' : ''}
      title="${item.label}"
    >
      <span class="sidebar__nav-icon">${getIcon(item.icon)}</span>
      <span class="sidebar__nav-text">${item.label}</span>
    </button>
  `;
}

export function buildSidebar(role, user) {
  const menu = SIDEBAR_MENUS[role] || SIDEBAR_MENUS['CODER'];
  const activeRoute = window.location.pathname || '/dashboard';
  const navEl = document.getElementById('sidebar-nav');

  if (!navEl) return;

  let html = '<ul role="menu" style="padding:0;">';

  menu.forEach(section => {
    html += `<li><span class="sidebar__section-label">${section.section}</span>`;
    html += '<ul role="none" style="padding:0;">';
    section.items.forEach(item => {
      html += `<li role="none">${buildNavItem(item, activeRoute)}</li>`;
    });
    html += '</ul></li>';
  });

  html += `
    <li role="none" style="margin-top: auto; padding-top: 16px;">
      <button
        class="sidebar__nav-item"
        onclick="handleLogout()"
        role="menuitem"
        title="Cerrar sesión"
      >
        <span class="sidebar__nav-icon">${getIcon('logout')}</span>
        <span class="sidebar__nav-text">Cerrar Sesión</span>
      </button>
    </li>
  `;

  html += '</ul>';
  navEl.innerHTML = html;

  if (user) {
    const initials = `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase() || '?';
    const nameEl   = document.getElementById('sidebar-user-name');
    const roleEl   = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-avatar');

    if (nameEl)   nameEl.textContent   = `${user.nombre || ''} ${user.apellido || ''}`.trim();
    if (roleEl)   roleEl.textContent   = role;
    if (avatarEl) avatarEl.textContent = initials;
  }
}

export function initSidebarCollapse() {
  const sidebar      = document.getElementById('sidebar');
  const mainWrapper  = document.getElementById('main-wrapper');
  const collapseBtn  = document.getElementById('sidebar-collapse-btn');
  const menuBtn      = document.getElementById('header-menu-btn');
  const overlay      = document.getElementById('sidebar-overlay');

  if (!sidebar || !collapseBtn) return;

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    mainWrapper?.classList.toggle('sidebar-collapsed', isCollapsed);
    collapseBtn.setAttribute('aria-expanded', String(!isCollapsed));
  });

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('mobile-open');
      overlay?.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  }
}

export function handleLogout() {
  sessionStorage.removeItem('tutorcode_user');
  sessionStorage.removeItem('tutorcode_token');
  window.navigateTo('/login');
}
