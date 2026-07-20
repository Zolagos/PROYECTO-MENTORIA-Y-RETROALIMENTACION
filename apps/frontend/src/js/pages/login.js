import { loginUser } from '../services/auth.js'
import { navigateTo } from '../router.js'
import { initApp } from '../app.js'

export function renderLogin() {
  return `
    <main class="login-page" role="main">
      <section class="login-brand" aria-hidden="true">
        <div class="login-brand__logo">
          <span class="login-brand__logo-text">TC</span>
        </div>
        <h1 class="login-brand__title">TutorCode</h1>
        <p class="login-brand__subtitle">
          The RIWI mentoring platform. Connecting coders, tutors and team leaders.
        </p>
        <ul class="login-brand__features">
          <li class="login-brand__feature">
            <div class="login-brand__feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span>Real-time mentoring management</span>
          </li>
          <li class="login-brand__feature">
            <div class="login-brand__feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>Feedback and observation in progress</span>
          </li>
          <li class="login-brand__feature">
            <div class="login-brand__feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <span>Metrics and dashboards for Team Leaders</span>
          </li>
        </ul>
      </section>

      <section class="login-form-panel">
        <div class="login-form-wrapper">
          <header class="login-form__header">
            <h2 class="login-form__title">Welcome back!</h2>
            <p class="login-form__description">
              Enter your credentials to access the platform.
            </p>
          </header>

          <div id="login-alert" class="alert alert--error hidden" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span id="login-alert-text">Incorrect credentials. Please try again.</span>
          </div>

          <form id="login-form" class="login-form" novalidate aria-label="Sign in form">
            <div class="form-group">
              <label for="login-email" class="form-label form-label--required">Email</label>
              <input
                type="email" id="login-email" name="email" class="form-input"
                placeholder="tucorreo@riwi.io" autocomplete="email" required
                aria-required="true" aria-describedby="email-error"
              />
              <span id="email-error" class="form-error hidden" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Enter a valid email address.
              </span>
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label form-label--required">Password</label>
              <div style="position:relative;">
                <input
                  type="password" id="login-password" name="password" class="form-input"
                  placeholder="••••••••" autocomplete="current-password" required
                  aria-required="true" aria-describedby="password-error"
                  style="padding-right: 44px;"
                />
                <button
                  type="button" id="toggle-password" aria-label="Show or hide password"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--color-text-muted);display:flex;align-items:center;padding:0;"
                >
                  <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span id="password-error" class="form-error hidden" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                The password must have at least 6 characters.
              </span>
            </div>
            <button type="submit" id="login-btn" class="btn btn-primary btn-full btn-lg">
              <span id="login-btn-text">Sign In</span>
              <svg id="login-spinner" class="hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="animation: spin 1s linear infinite;">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </button>
          </form>

          <p class="login-form__footer">
            Only the administrator can create accounts.<br/>
            Contact your Team Leader if you don't have access.
          </p>

          <div class="login-riwi">
            <span>Powered by</span>
            <strong style="color: var(--color-primary);">&lt;/RIWI&gt;</strong>
          </div>
        </div>
      </section>
    </main>
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    </style>
  `;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function showFieldError(input, errorEl) {
  input.classList.add('form-input--error');
  errorEl.classList.remove('hidden');
  input.setAttribute('aria-invalid', 'true');
}

function clearFieldError(input, errorEl) {
  input.classList.remove('form-input--error');
  errorEl.classList.add('hidden');
  input.setAttribute('aria-invalid', 'false');
}

function showLoginAlert(message) {
  const alertText = document.getElementById('login-alert-text');
  if (alertText) alertText.textContent = message;
  const alert = document.getElementById('login-alert');
  if (alert) alert.classList.remove('hidden');
}

function hideLoginAlert() {
  const alert = document.getElementById('login-alert');
  if (alert) alert.classList.add('hidden');
}

function setLoadingState(loading) {
  const btn = document.getElementById('login-btn');
  const btnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-spinner');
  if (!btn) return;
  btn.disabled = loading;
  if (btnText) btnText.textContent = loading ? 'Logging in...' : 'Sign In';
  if (spinner) spinner.classList.toggle('hidden', !loading);
}

export function initLogin() {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const togglePwdBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  if (!loginForm) return;

  if (togglePwdBtn && passwordInput && eyeIcon) {
    togglePwdBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      if (isPassword) {
        eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
        togglePwdBtn.setAttribute('aria-label', 'Hide password');
      } else {
        eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
        togglePwdBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

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

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideLoginAlert();
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    let hasError = false;

    if (!email || !isValidEmail(email)) {
      showFieldError(emailInput, emailError);
      hasError = true;
    }

    if (!password || password.length < 6) {
      showFieldError(passwordInput, passwordError);
      hasError = true;
    }

    if (hasError) {
      if (emailInput?.classList.contains('form-input--error')) {
        emailInput.focus();
      } else {
        passwordInput?.focus();
      }
      return;
    }

    setLoadingState(true);

    try {
      const user = await loginUser(email, password);

      document.body.classList.remove('route-login');
      document.body.classList.add('route-app');
      initApp(user);
      navigateTo('/dashboard');
    } catch (error) {
      showLoginAlert(error.message || 'Error signing in. Please try again.');
      setLoadingState(false);
    }
  });
}
