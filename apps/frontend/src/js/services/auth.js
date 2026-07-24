/**
 * auth.js — Authentication service
 *
 * What does it do?
 * Handles the full authentication flow against the Express backend:
 * 1. Sends email + password to POST /api/auth/login
 * 2. The backend validates with bcrypt and returns a JWT + profile
 * 3. Translates the backend role into the frontend format
 * 4. Saves the token and profile in sessionStorage
 *
 * Loaded in login.html (before pages/login.js).
 *
 * Kevin Mendoza | Frontend Developer
 */

// ---- BACKEND BASE URL ----
// Set VITE_API_URL at build time in production (e.g. Railway); falls back to local dev server.
const AUTH_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ---- ROLE MAPPING ----
// The backend uses the names from the roles table; the frontend uses
// the short keys from SIDEBAR_MENUS (sidebar.js)
const ROLE_MAP = {
  'Team Leader': 'TL',
  'Tutor': 'TUTOR',
  'Coder': 'CODER',
};

/**
 * Logs in against the backend.
 * Called from login.js when the user submits the form.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - User profile saved in session
 */
export async function loginUser(email, password) {
  let response;

  try {
    response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // Network error: backend down or no connection
    throw new Error('Could not connect to the server. Please check if the backend is running.');
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Email or password are incorrect.');
    }
    throw new Error(result.message || 'Error occurred while trying to log in. Please try again.');
  }

  const { token, user } = result.data;

  // Translates the backend profile into the shape used by the frontend
  const sessionUser = {
    id:       user.id,
    name:     user.name,
    lastName: user.lastname,
    email:    user.email,
    role:     ROLE_MAP[user.role] || 'CODER',
    clan:     user.clanId,
  };

  sessionStorage.setItem('tutorcode_token', token);
  sessionStorage.setItem('tutorcode_user', JSON.stringify(sessionUser));

  return sessionUser;
}
