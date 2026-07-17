/**
 * login.js — Lógica de la pantalla de inicio de sesión
 *
 * ¿Qué hace?
 * 1. Valida el formulario de login (email y contraseña)
 * 2. Muestra errores claros al usuario
 * 3. Simula el estado de "cargando" mientras se procesa
 * 4. Redirige a app.html al enviar (Sprint 4: conectará con Firebase)
 *
 * ¿Por qué validamos en el frontend?
 * Para dar feedback inmediato al usuario sin esperar al servidor.
 * El backend TAMBIÉN valida — la validación frontend es solo UX.
 *
 * Kevin Mendoza | Frontend Developer
 */

// Referencias a elementos del DOM
const loginForm     = document.getElementById('login-form');
const emailInput    = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const loginBtn      = document.getElementById('login-btn');
const loginBtnText  = document.getElementById('login-btn-text');
const loginSpinner  = document.getElementById('login-spinner');
const loginAlert    = document.getElementById('login-alert');
const emailError    = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const togglePwdBtn  = document.getElementById('toggle-password');
const eyeIcon       = document.getElementById('eye-icon');

// ---- VALIDACIÓN ----

/**
 * Valida que el email tenga formato correcto.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // Regex simple pero efectivo para formato email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Muestra un error de validación en un campo específico.
 * @param {HTMLElement} input - El campo con error
 * @param {HTMLElement} errorEl - El span de error
 */
function showFieldError(input, errorEl) {
  input.classList.add('form-input--error');
  errorEl.classList.remove('hidden');
  // Accesibilidad: anuncia el error al lector de pantalla
  input.setAttribute('aria-invalid', 'true');
}

/**
 * Limpia el error de un campo específico.
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function clearFieldError(input, errorEl) {
  input.classList.remove('form-input--error');
  errorEl.classList.add('hidden');
  input.setAttribute('aria-invalid', 'false');
}

/**
 * Muestra el alert general de error (credenciales incorrectas).
 * @param {string} message
 */
function showLoginAlert(message) {
  const alertText = document.getElementById('login-alert-text');
  if (alertText) alertText.textContent = message;
  loginAlert.classList.remove('hidden');
}

/**
 * Oculta el alert general.
 */
function hideLoginAlert() {
  loginAlert.classList.add('hidden');
}

/**
 * Activa/desactiva el estado de carga del botón.
 * @param {boolean} loading
 */
function setLoadingState(loading) {
  loginBtn.disabled = loading;
  loginBtnText.textContent = loading ? 'Iniciando sesión...' : 'Iniciar Sesión';
  if (loading) {
    loginSpinner.classList.remove('hidden');
  } else {
    loginSpinner.classList.add('hidden');
  }
}

// ---- TOGGLE MOSTRAR/OCULTAR CONTRASEÑA ----
if (togglePwdBtn) {
  togglePwdBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';

    // Cambia el tipo del input
    passwordInput.type = isPassword ? 'text' : 'password';

    // Actualiza el ícono y el aria-label
    if (isPassword) {
      // Ojo cerrado (contraseña visible)
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
      togglePwdBtn.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
      // Ojo abierto (contraseña oculta)
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
      togglePwdBtn.setAttribute('aria-label', 'Mostrar contraseña');
    }
  });
}

// ---- LIMPIAR ERRORES EN TIEMPO REAL ----
// Cuando el usuario empieza a escribir, limpiamos el error

if (emailInput) {
  emailInput.addEventListener('input', () => {
    clearFieldError(emailInput, emailError);
    hideLoginAlert();
  });
}

if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordInput, passwordError);
    hideLoginAlert();
  });
}

// ---- SUBMIT DEL FORMULARIO ----
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    // Prevenir envío por defecto del formulario
    e.preventDefault();

    // Limpiar errores anteriores
    hideLoginAlert();
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);

    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    // ---- Validación ----
    let hasError = false;

    if (!email || !isValidEmail(email)) {
      showFieldError(emailInput, emailError);
      hasError = true;
    }

    if (!password || password.length < 6) {
      showFieldError(passwordInput, passwordError);
      hasError = true;
    }

    // Si hay errores, no continuar
    if (hasError) {
      // Foco al primer campo con error para accesibilidad
      if (emailInput.classList.contains('form-input--error')) {
        emailInput.focus();
      } else {
        passwordInput.focus();
      }
      return;
    }

    // ---- Simular envío (Sprint 4: reemplazar con llamada real) ----
    setLoadingState(true);

    try {
      // TODO Sprint 4: reemplazar con llamada real a Firebase Auth
      // const result = await authService.login(email, password);
      await simulateLogin(email, password);

      // Redirige a la app principal
      window.location.href = '../pages/app.html';

    } catch (error) {
      // Muestra el error al usuario
      showLoginAlert(error.message || 'Error al iniciar sesión. Intenta de nuevo.');
      setLoadingState(false);
    }
  });
}

/**
 * Simula el proceso de login para desarrollo.
 * Sprint 4: esto se reemplaza con Firebase Authentication real.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
function simulateLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Cualquier email/contraseña válidos pasan en desarrollo
      // Sprint 4: Firebase validará las credenciales reales
      if (email && password.length >= 6) {
        // Guarda un usuario de prueba en sessionStorage
        const mockUser = {
          nombre:   'Kevin',
          apellido: 'Mendoza',
          email:    email,
          rol:      'TL',   // Cambia para probar roles
          clan:     'Alpha',
        };
        sessionStorage.setItem('tutorlink_user', JSON.stringify(mockUser));
        resolve(mockUser);
      } else {
        reject(new Error('Credenciales inválidas.'));
      }
    }, 1200); // Simula 1.2 segundos de delay de red
  });
}
