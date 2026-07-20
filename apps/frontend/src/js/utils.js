/**
 * utils.js — TutorCode global utility functions
 *
 * What does it contain?
 * - openModal / closeModal: control the modals
 * - showToast: floating notifications (success, error, info)
 * - formatDate: formats readable dates
 * - debounce: optimizes real-time searches
 *
 * Why separate?
 * These functions are used by ALL pages. Keeping them in their
 * own file avoids duplicating code and makes maintenance easier.
 *
 * Kevin Mendoza | Frontend Developer
 */

// ============================================================
// MODALS
// ============================================================

/**
 * openModal — Opens a modal by its ID.
 * @param {string} modalId - ID of the .modal-overlay element
 */
export function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus on the first interactive element (accessibility)
  setTimeout(() => {
    const firstFocusable = overlay.querySelector('input, select, textarea, button:not(.modal__close)');
    if (firstFocusable) firstFocusable.focus();
  }, 100);

  // Close with Escape
  document.addEventListener('keydown', handleEscapeKey);

  // Focus trap: keeps focus within the modal when using Tab
  overlay.addEventListener('keydown', handleFocusTrap);

  // Close when clicking the dark background
  overlay.addEventListener('click', handleOverlayClick);
}

/**
 * closeModal — Closes a modal by its ID.
 * @param {string} modalId
 */
export function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Clears form errors
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
 * handleFocusTrap — Keeps focus within the modal when using Tab.
 * Accessibility: a keyboard user can't accidentally leave the modal.
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
    // Shift+Tab: if on the first element, jump to the last
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    // Tab: if on the last element, jump to the first
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

/** Closes the active modal when pressing Escape */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) closeModal(activeModal.id);
  }
}

/** Closes the modal when clicking the dark background */
function handleOverlayClick(e) {
  // Only closes if the click was on the overlay, not the modal itself
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
}

// ============================================================
// TOAST (floating notifications)
// ============================================================

// Toast container — created only once
let toastContainer = null;

/**
 * Shows a temporary floating notification.
 * @param {string} message - Toast text
 * @param {'success'|'error'|'warning'|'info'} type - Toast type
 * @param {number} duration - Duration in ms (default: 4000)
 */
export function showToast(message, type = 'info', duration = 4000) {
  // Creates the container if it doesn't exist
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

  // Visual configuration per type
  const config = {
    success: { bg: '#00C48C', icon: '✓', label: 'Success' },
    error:   { bg: '#E53935', icon: '✕', label: 'Error' },
    warning: { bg: '#FFB300', icon: '⚠', label: 'Warning' },
    info:    { bg: '#1877F2', icon: 'ℹ', label: 'Info' },
  };
  const { bg, icon, label } = config[type] || config.info;

  // Creates the toast
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
    " aria-label="Close notification">×</button>
  `;

  toastContainer.appendChild(toast);

  // Auto-removes after the defined time
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 250ms ease forwards';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// Toast animations (injected only once)
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
// DATE UTILITIES
// ============================================================

/**
 * Formats an ISO date into readable English text.
 * @param {string} isoDate - Date in ISO format (e.g: "2026-07-15")
 * @returns {string} - E.g: "July 15, 2026"
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate + 'T00:00:00'); // avoids timezone offset
  return date.toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

/**
 * Returns "X minutes/hours/days ago" from a date.
 * @param {string} isoDate
 * @returns {string}
 */
export function timeAgo(isoDate) {
  const now  = new Date();
  const then = new Date(isoDate);
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)} h ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// ============================================================
// DEBOUNCE (avoids searching on every keystroke)
// ============================================================

/**
 * Delays a function's execution until the user stops
 * typing for 'delay' milliseconds.
 *
 * @param {Function} fn - Function to execute
 * @param {number} delay - Wait time in ms (default: 300)
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
