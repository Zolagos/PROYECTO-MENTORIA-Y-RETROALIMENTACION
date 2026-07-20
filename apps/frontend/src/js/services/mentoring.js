/**
 * mentoring.js — Mentoring data service
 *
 * What does it do?
 * Loads scheduled sessions (GET /api/sessions) and mentoring requests
 * (GET /api/mentoring-requests) from the backend, normalizes both shapes
 * into a common card-friendly format, and exposes the actions the
 * Mentoring page needs (status changes / delete on requests, plus the
 * still-local-only create/edit/delete for sessions — no backend endpoint
 * exists yet to persist a full session).
 */

import { mentoringService, sessionsService, usersService } from './api.js';

// ---- AVAILABLE TUTORS ----
let tutorsCache = [];

/** Returns the available tutors for the modal select */
export function getTutors() {
  return tutorsCache;
}

/** Finds a tutor by id */
export function getTutorById(id) {
  return tutorsCache.find(t => t.id === Number(id)) || null;
}

/** Loads the available tutors from the backend */
export async function loadTutors() {
  const res = await usersService.getAll({ role: 'Tutor' });
  tutorsCache = (res.data || []).map(u => ({
    id: u.id,
    name: `${u.name} ${u.lastname}`.trim(),
  }));
  return tutorsCache;
}

// ---- CACHE ----
// Holds the last-fetched, normalized items (sessions + requests) so
// synchronous lookups (getSessionById) and card actions work without refetching.
let cache = [];

/** Splits an ISO timestamp into a YYYY-MM-DD date and HH:MM time (local time) */
function splitDateTime(isoString) {
  if (!isoString) return { date: '', time: '' };
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function initials(name, lastname) {
  const first = name?.[0] || '';
  const last = lastname?.[0] || '';
  return (first + last).toUpperCase() || '—';
}

/** Maps a mentoring_sessions row (GET /sessions) into the card shape */
function mapSessionToCard(row) {
  const { date, time } = splitDateTime(row.start_time);
  return {
    kind: 'session',
    id: row.id,
    topic: row.topic,
    desc: row.description || '',
    tutorId: row.tutor_id,
    tutor: row.tutor_name ? `${row.tutor_name} ${row.tutor_lastname || ''}`.trim() : '—',
    date,
    time,
    modality: (row.modality || '').replace(' ', '-'),
    link: row.meeting_link || row.link || '',
    room: row.room || '',
    type: row.session_type || 'open',
    status: (row.status || 'scheduled').replace(/_/g, '-'),
    coders: (row.coders || []).map(c => initials(c.name, c.lastname)),
    codersDetail: row.coders || [],
    tutorDetail: row.tutor_name
      ? { name: row.tutor_name, lastname: row.tutor_lastname || '', role: 'Tutor' }
      : null,
  };
}

/** Maps a mentoring_requests row (GET /mentoring-requests) into the card shape */
function mapRequestToCard(row) {
  const { date } = splitDateTime(row.request_date);
  return {
    kind: 'request',
    id: row.id,
    topic: row.topic,
    desc: row.description || '',
    coderId: row.coder_id,
    coder: row.coder_name ? `${row.coder_name} ${row.coder_lastname || ''}`.trim() : '—',
    date,
    status: row.state,
  };
}

/** Fetches and normalizes scheduled sessions visible to the current user */
export async function getScheduledSessions() {
  const response = await sessionsService.getAll();
  return (response?.data || []).map(mapSessionToCard);
}

/** Fetches and normalizes mentoring requests visible to the current user */
export async function getMentoringRequests() {
  const response = await mentoringService.getAll();
  return (response?.data || []).map(mapRequestToCard);
}

/**
 * Fetches everything the current user should see on the Mentoring page
 * (both scheduled sessions and mentoring requests — the backend already
 * scopes each list to the caller's role/ownership) and refreshes the cache.
 */
export async function getVisibleMentoringItems() {
  const [sessions, requests] = await Promise.all([
    getScheduledSessions(),
    getMentoringRequests(),
  ]);
  cache = [...sessions, ...requests];
  return cache;
}

/** Returns the cached sessions (kind === 'session') without refetching */
export function getSessions() {
  return cache.filter(m => m.kind === 'session');
}

/** Finds a cached item (session or request) by id */
export function getSessionById(id) {
  return cache.find(m => m.id === Number(id)) || null;
}

/** Creates a new session card locally (no backend endpoint yet — not persisted) */
export function createSession(mentoring) {
  mentoring.id = Date.now();
  mentoring.kind = 'session';
  mentoring.status = mentoring.status || 'scheduled';
  mentoring.coders = mentoring.coders || [];
  cache.push(mentoring);
}

/** Updates a session card locally (no backend endpoint yet — not persisted) */
export function updateSession(mentoring) {
  cache = cache.map(m => (m.id === mentoring.id ? { ...m, ...mentoring } : m));
}

/** Removes a session card locally (no backend endpoint yet — not persisted) */
export function deleteSession(id) {
  cache = cache.filter(m => m.id !== Number(id));
}

/** Accepts/denies a mentoring request (TL and Tutor only, enforced server-side) */
export async function changeRequestStatus(id, state) {
  const response = await mentoringService.changeStatus(id, state);
  const updated = response?.data;
  if (updated) {
    cache = cache.map(m => (m.kind === 'request' && m.id === Number(id) ? mapRequestToCard(updated) : m));
  }
  return updated;
}

/** Deletes a mentoring request (TL only, enforced server-side) */
export async function deleteRequestItem(id) {
  await mentoringService.delete(id);
  cache = cache.filter(m => !(m.kind === 'request' && m.id === Number(id)));
}
