/**
 * api.js — Service layer for communicating with the backend
 *
 * What does it do?
 * Centralizes ALL fetch calls to the Express backend.
 * Each function corresponds to an API endpoint.
 *
 * Why centralize?
 * If the backend changes a route, we only change it here —
 * not on every page. A single source of truth.
 *
 * How does it work?
 * 1. The function builds the request (method, headers, body)
 * 2. It calls fetchAPI() which handles errors globally
 * 3. It returns the data or throws a descriptive error
 *
 * CURRENT STATE: Sprint 4 — connect when the backend is ready.
 * Each function has a TODO with the expected endpoint.
 *
 * Kevin Mendoza | Frontend Developer
 */

import { navigateTo } from '../router.js';

// ---- BACKEND BASE URL ----
// Set VITE_API_URL at build time in production (e.g. Railway); falls back to local dev server.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ============================================================
// BASE FETCH FUNCTION
// ============================================================

/**
 * Base function that wraps fetch with error handling.
 * All other functions use it internally.
 *
 * @param {string} endpoint - Relative path (e.g: '/mentoring')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} - JSON response data
 */

export async function fetchAPI(endpoint, options = {}) {
  // Gets the Firebase token from sessionStorage
  // Sprint 4: this will come directly from Firebase Auth
  const token = sessionStorage.getItem('tutorcode_token');

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

    // Expired session or invalid token: clear and return to login
    if (response.status === 401) {
      sessionStorage.removeItem('tutorcode_user');
      sessionStorage.removeItem('tutorcode_token');
      navigateTo('/login');
      throw new Error('Your session has expired. Please log in again.');
    }

    // If the server responds with an HTTP error (400, 404, 500...)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    // If the response is 204 No Content (e.g: successful DELETE)
    if (response.status === 204) return null;

    return await response.json();

  } catch (error) {
    // Network error (no connection, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Could not connect to the server. Please verify that the backend is running.');
    }
    throw error;
  }
}

// ============================================================
// MENTORING SERVICES
// ============================================================

export const mentoringService = {
  /**
   * Gets all mentoring requests (filtered/scoped by role server-side).
   */
  async getAll(filters = {}) {
    const options = {
      method: 'GET',
    }
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/mentoring-requests${params ? '?' + params : ''}`, options);

  },

  /**
   * Gets a mentoring request by ID.
   */
  async getById(id) {
    return await fetchAPI(`/mentoring-requests/${id}`);
  },

  /**
   * Creates a new mentoring request (Coder only).
   * @param {Object} data - { topic, description }
   */
  async create(data) {
    return await fetchAPI('/mentoring-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Changes a mentoring request's status (accept/deny). TL and Tutor only.
   * @param {number} id
   * @param {'accepted'|'denied'} state
   */
  async changeStatus(id, state) {
    return await fetchAPI(`/mentoring-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ mentoring_status: state }),
    });
  },

  /**
   * Deletes a mentoring request. TL only.
   */
  async delete(id) {
    return await fetchAPI(`/mentoring-requests/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// SESSIONS SERVICES
// ============================================================

export const sessionsService = {
  /**
   * Gets all scheduled mentoring sessions (filtered/scoped by role server-side).
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/sessions${params ? '?' + params : ''}`);
  },

  /**
   * Creates a new mentoring session. TL and Tutor only.
   * @param {Object} data - { topic, description, mentorship_type, modality, session_type, room, meeting_link, start_time, end_time, tutor_id }
   */
  async create(data) {
    return await fetchAPI('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates a scheduled mentoring session. TL and Tutor only.
   * @param {number} id
   * @param {Object} data - Same shape as create(), all fields optional.
   */
  async update(id, data) {
    return await fetchAPI(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Changes a session's status (scheduled/in_progress/completed/cancelled).
   * Allowed transitions and permissions are enforced server-side.
   * @param {number} id
   * @param {'scheduled'|'in_progress'|'completed'|'cancelled'} status
   */
  async updateStatus(id, status) {
    return await fetchAPI(`/sessions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Assigns coder participants to a scheduled session. TL and Tutor only.
   * @param {number} id
   * @param {number[]} coderIds
   */
  async assignParticipants(id, coderIds) {
    return await fetchAPI(`/sessions/${id}/participants`, {
      method: 'POST',
      body: JSON.stringify({ coderIds }),
    });
  },

  /**
   * Submits feedback for a completed session. Coder only.
   * @param {number} sessionId
   * @param {Object} data - { tutor_rating, session_rating, comments }
   */
  async submitFeedback(sessionId, data) {
    return await fetchAPI(`/sessions/${sessionId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================
// DASHBOARD SERVICE
// ============================================================

export const dashboardService = {
  async getSummary() {
    return await fetchAPI('/dashboard/summary');
  },
  async getMetrics() {
    return await fetchAPI('/dashboard/metrics');
  },
};

// ============================================================
// OBSERVATIONS SERVICES
// ============================================================

export const observationsService = {
  /**
   * Gets the unified coder+tutor observations timeline (role-scoped server-side).
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/observations${params ? '?' + params : ''}`);
  },
};

export const coderObservationsService = {
  /**
   * Creates a coder observation. Tutor and Team Leader only.
   * @param {Object} data - { coder_id, session_id?, observation, recommendation? }
   */
  async create(data) {
    return await fetchAPI('/coder-observations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates a coder observation. Tutor and Team Leader only.
   */
  async update(id, data) {
    return await fetchAPI(`/coder-observations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Deletes a coder observation. Team Leader only.
   */
  async delete(id) {
    return await fetchAPI(`/coder-observations/${id}`, { method: 'DELETE' });
  },
};

export const tutorObservationsService = {
  /**
   * Creates a tutor observation. Team Leader only.
   * @param {Object} data - { tutor_id, session_id?, observation, recommendation?, technical_notes? }
   */
  async create(data) {
    return await fetchAPI('/tutor-observations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates a tutor observation. Team Leader only.
   */
  async update(id, data) {
    return await fetchAPI(`/tutor-observations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Deletes a tutor observation. Team Leader only.
   */
  async delete(id) {
    return await fetchAPI(`/tutor-observations/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// USER SERVICES
// ============================================================

export const usersService = {
  /**
   * Gets all users (TL only).
   * TODO Sprint 4: GET /api/users
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/users${params ? '?' + params : ''}`);
  },

  /**
   * Gets the authenticated user's profile.
   * TODO Sprint 4: GET /api/users/me
   */
  async getProfile() {
    return await fetchAPI('/users/me');
  },
};
