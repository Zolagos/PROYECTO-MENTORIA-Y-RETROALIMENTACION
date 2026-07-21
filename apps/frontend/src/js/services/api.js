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
// TODO Sprint 4: change to your team's real server URL
const API_BASE_URL = 'http://localhost:3000/api';

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
// AUTHENTICATION SERVICES
// ============================================================

export const authService = {
  /**
   * Logs in with Firebase and validates against the backend.
   * TODO Sprint 4: integrate the Firebase Auth SDK
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user, token}>}
   */
  async login(email, password) {
    // Step 1: Authenticate with Firebase (returns an ID Token)
    // const firebaseResult = await firebase.auth().signInWithEmailAndPassword(email, password);
    // const idToken = await firebaseResult.user.getIdToken();

    // Step 2: Validate the token against the backend and get the profile
    // return await fetchAPI('/auth/verify', {
    //   method: 'POST',
    //   body: JSON.stringify({ idToken }),
    // });

    throw new Error('TODO: Implement in Sprint 4 with real Firebase Auth.');
  },

  /**
   * Logs the user out.
   */
  async logout() {
    // TODO Sprint 4: firebase.auth().signOut()
    sessionStorage.removeItem('tutorcode_user');
    sessionStorage.removeItem('tutorcode_token');
    navigateTo('/login');
  },
};

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
};

// ============================================================
// OBSERVATIONS SERVICES
// ============================================================

export const observationsService = {
  /**
   * Gets all observations.
   * TODO Sprint 4: GET /api/observations
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchAPI(`/observations${params ? '?' + params : ''}`);
  },

  /**
   * Creates a new observation.
   * TODO Sprint 4: POST /api/observations
   * @param {Object} data - { targetUserId, type, text }
   */
  async create(data) {
    return await fetchAPI('/observations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates an observation.
   * TODO Sprint 4: PUT /api/observations/:id
   */
  async update(id, data) {
    return await fetchAPI(`/observations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Deletes an observation.
   * TODO Sprint 4: DELETE /api/observations/:id
   */
  async delete(id) {
    return await fetchAPI(`/observations/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// FEEDBACK SERVICES
// ============================================================

export const feedbackService = {
  /**
   * Gets all feedback.
   * TODO Sprint 4: GET /api/feedback
   */
  async getAll() {
    return await fetchAPI('/feedback');
  },

  /**
   * Creates a new feedback entry.
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
