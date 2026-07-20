/**
 * auth.js — Servicio de autenticación
 *
 * ¿Qué hace?
 * Maneja el flujo completo de autenticación contra el backend Express:
 * 1. Envía email + contraseña a POST /api/auth/login
 * 2. El backend valida con bcrypt y devuelve un JWT + perfil
 * 3. Traduce el rol del backend al formato del frontend
 * 4. Guarda token y perfil en sessionStorage
 *
 * Se carga en login.html (antes de pages/login.js).
 *
 * Kevin Mendoza | Frontend Developer
 */

// ---- URL BASE DEL BACKEND ----
const AUTH_API_URL = 'http://localhost:3000/api';

// ---- MAPEO DE ROLES ----
// El backend usa los nombres de la tabla roles; el frontend usa
// las claves cortas de SIDEBAR_MENUS (sidebar.js)
const ROLE_MAP = {
  'Team Leader': 'TL',
  'Tutor': 'TUTOR',
  'Coder': 'CODER',
};

/**
 * Inicia sesión contra el backend.
 * Llamada desde login.js cuando el usuario envía el formulario.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - Perfil del usuario guardado en sesión
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
    // Error de red: backend caído o sin conexión
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

  // Traduce el perfil del backend al formato que usa el frontend
  const sessionUser = {
    id:       user.id,
    nombre:   user.name,
    apellido: user.lastname,
    email:    user.email,
    rol:      ROLE_MAP[user.role] || 'CODER',
    clan:     user.clanId,
  };

  sessionStorage.setItem('tutorcode_token', token);
  sessionStorage.setItem('tutorcode_user', JSON.stringify(sessionUser));

  return sessionUser;
}
