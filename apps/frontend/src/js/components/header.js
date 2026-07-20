/**
 * header.js — Lógica del header principal
 *
 * ¿Qué hace?
 * - Actualiza el avatar del header con las iniciales del usuario
 * - Maneja el menú de usuario al hacer click en el avatar
 * - Prepara el botón de notificaciones

 */

/**
 * Inicializa el header con la información del usuario activo.
 * @param {Object} user - { nombre, apellido, rol }
 */
export function initHeader(user) {
  const avatarEl = document.getElementById('header-avatar');
  if (!avatarEl || !user) return;

  const initials = `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase() || '?';
  avatarEl.textContent = initials;

  // Click en avatar: toggle del menú de usuario
  avatarEl.addEventListener('click', toggleUserMenu);
  avatarEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleUserMenu();
    }
  });
}

/**
 * Muestra u oculta el menú desplegable del usuario en el header.
 */
function toggleUserMenu() {
  // Si el menú ya existe, lo cierra
  const existing = document.getElementById('user-dropdown');
  if (existing) {
    existing.remove();
    return;
  }

  const avatarEl = document.getElementById('header-avatar');
  if (!avatarEl) return;

  const rect = avatarEl.getBoundingClientRect();

  const dropdown = document.createElement('div');
  dropdown.id = 'user-dropdown';
  dropdown.setAttribute('role', 'menu');
  dropdown.setAttribute('aria-label', 'Menú de usuario');
  dropdown.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 8}px;
    right: ${window.innerWidth - rect.right}px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    min-width: 200px;
    z-index: 300;
    overflow: hidden;
    animation: fadeIn 150ms ease;
  `;

  dropdown.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    </style>
    <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border);">
      <div style="font-size: 13px; font-weight: 600; color: var(--color-text-primary);" id="dropdown-name">
        Mi Cuenta
      </div>
      <div style="font-size: 12px; color: var(--color-text-muted);" id="dropdown-role"></div>
    </div>
    <div style="padding: 8px;">
      <button
        role="menuitem"
        onclick="this.closest('#user-dropdown').remove(); navigateTo('/profile')"
        style="
          width: 100%; text-align: left; padding: 10px 12px;
          border-radius: 6px; border: none; background: none;
          cursor: pointer; font-size: 13px; color: var(--color-text-primary);
          display: flex; align-items: center; gap: 10px;
          transition: background-color 150ms;
        "
        onmouseenter="this.style.backgroundColor='var(--color-bg)'"
        onmouseleave="this.style.backgroundColor='transparent'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Mi Perfil
      </button>
      <button
        role="menuitem"
        onclick="handleLogout()"
        style="
          width: 100%; text-align: left; padding: 10px 12px;
          border-radius: 6px; border: none; background: none;
          cursor: pointer; font-size: 13px; color: var(--color-accent-red);
          display: flex; align-items: center; gap: 10px;
          transition: background-color 150ms;
        "
        onmouseenter="this.style.backgroundColor='rgba(229,57,53,0.08)'"
        onmouseleave="this.style.backgroundColor='transparent'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Cerrar Sesión
      </button>
    </div>
  `;

  document.body.appendChild(dropdown);

  // Rellena nombre y rol
  const user = getSessionUser();
  if (user) {
    const dropName = document.getElementById('dropdown-name');
    const dropRole = document.getElementById('dropdown-role');
    if (dropName) dropName.textContent = `${user.nombre} ${user.apellido}`;
    if (dropRole) dropRole.textContent = user.rol;
  }

  // Cierra al hacer click fuera
  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!dropdown.contains(e.target) && e.target !== avatarEl) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 0);
}

/**
 * Obtiene el usuario de la sesión actual.
 * Sprint 4: esto vendrá del token de Firebase/backend.
 * Por ahora usa sessionStorage como placeholder.
 */
export function getSessionUser() {
  try {
    const stored = sessionStorage.getItem('tutorcode_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
