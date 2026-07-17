/**
 * api.js — Capa de servicios para comunicarse con el backend
 *
 * ¿Qué hace?
 * Centraliza TODAS las llamadas fetch al backend Express.
 * Cada función corresponde a un endpoint de la API.
 *
 * ¿Por qué centralizar?
 * Si el backend cambia una ruta, solo cambiamos aquí —
 * no en cada página. Un solo lugar de verdad.
 *
 * ¿Cómo funciona?
 * 1. La función arma la petición (método, headers, body)
 * 2. Llama a fetchAPI() que maneja errores globalmente
 * 3. Devuelve los datos o lanza un error descriptivo
 *
 * ESTADO ACTUAL: Sprint 4 — conectar cuando el backend esté listo.
 * Cada función tiene un TODO con el endpoint esperado.
 *
 * Kevin Mendoza | Frontend Developer
 */

// ---- URL BASE DEL BACKEND ----
// TODO Sprint 4: cambiar a la URL real del servidor de tu equipo
const API_BASE_URL = 'http://localhost:3000/api';

// ============================================================
// FUNCIÓN BASE DE FETCH
// ============================================================

/**
 * Función base que envuelve fetch con manejo de errores.
 * Todas las demás funciones la usan internamente.
 *
 * @param {string} endpoint - Ruta relativa (ej: '/mentoring')
 * @param {Object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<any>} - Datos de la respuesta JSON
 */
async function fetchAPI(endpoint, options = {}) {
  // Obtiene el token de Firebase del sessionStorage
  // Sprint 4: esto vendrá de Firebase Auth directamente
  const token = sessionStorage.getItem('tutorlink_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Sesión vencida o token inválido: limpiar y volver al login
    if (response.status === 401) {
      sessionStorage.removeItem('tutorlink_user');
      sessionStorage.removeItem('tutorlink_token');
      window.location.href = '../pages/login.html';
      throw new Error('Tu sesión expiró. Inicia sesión de nuevo.');
    }

    // Si el servidor responde con error HTTP (400, 404, 500...)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    // Si la respuesta es 204 No Content (ej: DELETE exitoso)
    if (response.status === 204) return null;

    return await response.json();

  } catch (error) {
    // Error de red (sin conexión, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    }
    throw error;
  }
}

// ============================================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================================

const authService = {
  /**
   * Inicia sesión con Firebase y valida contra el backend.
   * TODO Sprint 4: integrar Firebase Auth SDK
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user, token}>}
   */
  async login(email, password) {
    // Paso 1: Autenticar con Firebase (devuelve ID Token)
    // const firebaseResult = await firebase.auth().signInWithEmailAndPassword(email, password);
    // const idToken = await firebaseResult.user.getIdToken();

    // Paso 2: Validar token contra el backend y obtener perfil
    // return await fetchAPI('/auth/verify', {
    //   method: 'POST',
    //   body: JSON.stringify({ idToken }),
    // });

    throw new Error('TODO: Implementar en Sprint 4 con Firebase Auth real.');
  },

  /**
   * Cierra sesión del usuario.
   */
  async logout() {
    // TODO Sprint 4: firebase.auth().signOut()
    sessionStorage.removeItem('tutorlink_user');
    sessionStorage.removeItem('tutorlink_token');
    window.location.href = '../pages/login.html';
  },
};

// ============================================================
// SERVICIOS DE MENTORÍAS
// ============================================================

const mentoringService = {
  /**
   * Obtiene todas las mentorías (filtradas según el rol).
   * TODO Sprint 4: GET /api/mentorias
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/mentorias${params ? '?' + params : ''}`);
  },

  /**
   * Obtiene una mentoría por ID.
   * TODO Sprint 4: GET /api/mentorias/:id
   */
  async getById(id) {
    return await fetchAPI(`/mentorias/${id}`);
  },

  /**
   * Crea una nueva mentoría.
   * TODO Sprint 4: POST /api/mentorias
   * @param {Object} data - { topic, tutorId, date, time, modality, location, description, type }
   */
  async create(data) {
    return await fetchAPI('/mentorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza una mentoría.
   * TODO Sprint 4: PUT /api/mentorias/:id
   */
  async update(id, data) {
    return await fetchAPI(`/mentorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Cambia el estado de una mentoría.
   * TODO Sprint 4: PATCH /api/mentorias/:id/estado
   */
  async changeStatus(id, status) {
    return await fetchAPI(`/mentorias/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: status }),
    });
  },

  /**
   * Elimina una mentoría.
   * TODO Sprint 4: DELETE /api/mentorias/:id
   */
  async delete(id) {
    return await fetchAPI(`/mentorias/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// SERVICIOS DE OBSERVACIONES
// ============================================================

const observationsService = {
  /**
   * Obtiene todas las observaciones.
   * TODO Sprint 4: GET /api/observaciones
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/observaciones${params ? '?' + params : ''}`);
  },

  /**
   * Crea una nueva observación.
   * TODO Sprint 4: POST /api/observaciones
   * @param {Object} data - { targetUserId, type, text }
   */
  async create(data) {
    return await fetchAPI('/observaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza una observación.
   * TODO Sprint 4: PUT /api/observaciones/:id
   */
  async update(id, data) {
    return await fetchAPI(`/observaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina una observación.
   * TODO Sprint 4: DELETE /api/observaciones/:id
   */
  async delete(id) {
    return await fetchAPI(`/observaciones/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// SERVICIOS DE FEEDBACK
// ============================================================

const feedbackService = {
  /**
   * Obtiene todos los feedbacks.
   * TODO Sprint 4: GET /api/feedback
   */
  async getAll() {
    return await fetchAPI('/feedback');
  },

  /**
   * Crea un nuevo feedback.
   * TODO Sprint 4: POST /api/feedback
   * @param {Object} data - { mentoringId, rating, comment }
   */
  async create(data) {
    return await fetchAPI('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================
// SERVICIOS DE USUARIOS
// ============================================================

const usersService = {
  /**
   * Obtiene todos los usuarios (solo TL/ADMIN).
   * TODO Sprint 4: GET /api/usuarios
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/usuarios${params ? '?' + params : ''}`);
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   * TODO Sprint 4: GET /api/usuarios/me
   */
  async getProfile() {
    return await fetchAPI('/usuarios/me');
  },
};
