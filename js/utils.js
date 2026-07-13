/**
 * utils.js — Funciones utilitarias globales de TutorLink
 *
 * ¿Qué contiene?
 * - openModal / closeModal: controlan los modales
 * - showToast: notificaciones flotantes (éxito, error, info)
 * - formatDate: formatea fechas legibles
 * - debounce: optimiza búsquedas en tiempo real
 *
 * ¿Por qué separado?
 * Estas funciones las usan TODAS las páginas. Tenerlas en un
 * archivo propio evita duplicar código y facilita el mantenimiento.
 *
 * Kevin Mendoza | Frontend Developer
 */

// ============================================================
// MODALES
// ============================================================

/**
 * openModal — Abre un modal por su ID.
 * @param {string} modalId - ID del elemento .modal-overlay
 */
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Foco en el primer elemento interactivo (accesibilidad)
  setTimeout(() => {
    const firstFocusable = overlay.querySelector('input, select, textarea, button:not(.modal__close)');
    if (firstFocusable) firstFocusable.focus();
  }, 100);

  // Cerrar con Escape
  document.addEventListener('keydown', handleEscapeKey);

  // Focus trap: mantiene el foco dentro del modal con Tab
  overlay.addEventListener('keydown', handleFocusTrap);

  // Cerrar al hacer click en el fondo oscuro
  overlay.addEventListener('click', handleOverlayClick);
}

/**
 * closeModal — Cierra un modal por su ID.
 * @param {string} modalId
 */
function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Limpia errores del formulario
  overlay.querySelectorAll('.form-input--error, .form-select--error, .form-textarea--error').forEach(el => {
    el.classList.remove('form-input--error', 'form-select--error', 'form-textarea--error');
    el.removeAttribute('aria-invalid');
  });
  overlay.querySelectorAll('.form-error').forEach(el => el.classList.add('hidden'));

  document.removeEventListener('keydown', handleEscapeKey);
  overlay.removeEventListener('keydown', handleFocusTrap);
  overlay.removeEventListener('click', handleOverlayClick);
}

/**
 * handleFocusTrap — Mantiene el foco dentro del modal al usar Tab.
 * Accesibilidad: el usuario de teclado no puede salir del modal accidentalmente.
 */
function handleFocusTrap(e) {
  if (e.key !== 'Tab') return;

  const focusableSelectors = 'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(e.currentTarget.querySelectorAll(focusableSelectors))
    .filter(el => !el.disabled && el.offsetParent !== null);

  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    // Shift+Tab: si está en el primero, salta al último
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    // Tab: si está en el último, salta al primero
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

/** Cierra el modal activo al presionar Escape */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) closeModal(activeModal.id);
  }
}

/** Cierra el modal al hacer click en el fondo oscuro */
function handleOverlayClick(e) {
  // Solo cierra si el click fue en el overlay, no en el modal en sí
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
}

// ============================================================
// TOAST (notificaciones flotantes)
// ============================================================

// Contenedor de toasts — se crea una sola vez
let toastContainer = null;

/**
 * Muestra una notificación flotante temporal.
 * @param {string} message - Texto del toast
 * @param {'success'|'error'|'warning'|'info'} type - Tipo de toast
 * @param {number} duration - Duración en ms (default: 4000)
 */
function showToast(message, type = 'info', duration = 4000) {
  // Crea el contenedor si no existe
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
      max-width: 360px;
    `;
    document.body.appendChild(toastContainer);
  }

  // Configuración visual por tipo
  const config = {
    success: { bg: '#00C48C', icon: '✓', label: 'Éxito' },
    error:   { bg: '#E53935', icon: '✕', label: 'Error' },
    warning: { bg: '#FFB300', icon: '⚠', label: 'Advertencia' },
    info:    { bg: '#1877F2', icon: 'ℹ', label: 'Información' },
  };
  const { bg, icon, label } = config[type] || config.info;

  // Crea el toast
  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-label', `${label}: ${message}`);
  toast.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    border-left: 4px solid ${bg};
    font-size: 14px;
    color: #1C1E21;
    animation: slideInRight 250ms ease;
    min-width: 260px;
  `;

  toast.innerHTML = `
    <span style="
      width: 24px; height: 24px; border-radius: 50%;
      background: ${bg}; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; flex-shrink: 0;
    ">${icon}</span>
    <span style="flex:1; line-height:1.5;">${message}</span>
    <button onclick="this.parentElement.remove()" style="
      background:none; border:none; cursor:pointer;
      color: #9EA3AD; font-size: 16px; padding: 0;
      line-height: 1; flex-shrink: 0;
    " aria-label="Cerrar notificación">×</button>
  `;

  toastContainer.appendChild(toast);

  // Auto-elimina después del tiempo definido
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 250ms ease forwards';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// Animaciones del toast (inyectadas una sola vez)
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(20px); }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// UTILIDADES DE FECHA
// ============================================================

/**
 * Formatea una fecha ISO a texto legible en español.
 * @param {string} isoDate - Fecha en formato ISO (ej: "2026-07-15")
 * @returns {string} - Ej: "15 de julio de 2026"
 */
function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate + 'T00:00:00'); // evita desfase de timezone
  return date.toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

/**
 * Devuelve "hace X minutos/horas/días" a partir de una fecha.
 * @param {string} isoDate
 * @returns {string}
 */
function timeAgo(isoDate) {
  const now  = new Date();
  const then = new Date(isoDate);
  const diff = Math.floor((now - then) / 1000); // segundos

  if (diff < 60)   return 'Hace un momento';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

// ============================================================
// DEBOUNCE (evita hacer búsquedas en cada keystroke)
// ============================================================

/**
 * Retrasa la ejecución de una función hasta que el usuario
 * deje de escribir por 'delay' milisegundos.
 *
 * @param {Function} fn - Función a ejecutar
 * @param {number} delay - Espera en ms (default: 300)
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
