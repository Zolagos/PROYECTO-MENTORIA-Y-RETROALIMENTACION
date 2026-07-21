/**
 * mentoring.js — Mentoring data service
 *
 * What does it do?
 * Loads scheduled sessions (GET /api/sessions) and mentoring requests
 * (GET /api/mentoring-requests) from the backend, normalizes both shapes
 * into a common card-friendly format, and exposes the actions the
 * Mentoring page needs (create/edit sessions, status changes, participant
 * assignment, request create/respond/delete).
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

// ---- AVAILABLE CODERS ----
let codersCache = [];

/** Returns the available coders for the participants/observations modals */
export function getCoders() {
  return codersCache;
}

/**
 * Loads the available coders from the backend.
 * `crossClan: true` is used only when assigning participants to an 'open'
 * session, which explicitly accepts coders from any clan.
 */
export async function loadCoders({ crossClan = false } = {}) {
  const params = { role: 'Coder' };
  if (crossClan) params.allClans = 'true';
  const res = await usersService.getAll(params);
  codersCache = (res.data || []).map(u => ({
    id: u.id,
    name: `${u.name} ${u.lastname}`.trim(),
  }));
  return codersCache;
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
  const { time: endTime } = splitDateTime(row.end_time);
  return {
    kind: 'session',
    id: row.id,
    topic: row.topic,
    desc: row.description || '',
    tutorId: row.tutor_id,
    tutor: row.tutor_name ? `${row.tutor_name} ${row.tutor_lastname || ''}`.trim() : '—',
    date,
    time,
    endTime,
    mentorshipType: row.mentorship_type || 'individual',
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

/** Builds the POST/PATCH /sessions payload from the modal's form values */
function buildSessionPayload(mentoring) {
  return {
    topic: mentoring.topic,
    description: mentoring.desc || null,
    mentorship_type: mentoring.mentorshipType,
    modality: mentoring.modality === 'in-person' ? 'in person' : mentoring.modality,
    session_type: mentoring.type || 'open',
    room: mentoring.modality === 'in-person' ? mentoring.room : null,
    meeting_link: mentoring.modality === 'virtual' ? mentoring.link : null,
    start_time: `${mentoring.date}T${mentoring.time}:00`,
    end_time: `${mentoring.date}T${mentoring.endTime}:00`,
    tutor_id: mentoring.tutorId,
  };
}

/** Creates a new session against the backend and refreshes the cache */
export async function createSession(mentoring) {
  const response = await sessionsService.create(buildSessionPayload(mentoring));
  const created = response?.data;
  if (created) cache.push(mapSessionToCard(created));
  return created;
}

/** Updates a scheduled session against the backend and refreshes the cache */
export async function updateSession(mentoring) {
  const response = await sessionsService.update(mentoring.id, buildSessionPayload(mentoring));
  const updated = response?.data;
  if (updated) {
    cache = cache.map(m => (m.kind === 'session' && m.id === mentoring.id ? mapSessionToCard(updated) : m));
  }
  return updated;
}

/** Changes a session's status against the backend (US-08) and refreshes the cache */
export async function changeSessionStatus(id, status) {
  const backendStatus = status.replace(/-/g, '_');
  const response = await sessionsService.updateStatus(id, backendStatus);
  const updated = response?.data;
  if (updated) {
    const newStatus = (updated.status || backendStatus).replace(/_/g, '-');
    cache = cache.map(m => (m.kind === 'session' && m.id === Number(id) ? { ...m, status: newStatus } : m));
  }
  return updated;
}

/** Creates a mentoring request (Coder only, enforced server-side) */
export async function createMentoringRequest(data) {
  return await mentoringService.create(data);
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

/** Assigns coder participants to a scheduled session (TL/Tutor, enforced server-side) */
export async function assignParticipants(id, coderIds) {
  const response = await sessionsService.assignParticipants(id, coderIds);
  const updated = response?.data;
  if (updated) {
    cache = cache.map(m => (m.kind === 'session' && m.id === Number(id) ? mapSessionToCard(updated) : m));
  }
  return updated;
}

/** Fetches the current coder's completed sessions, for the Feedback form's dropdown */
export async function getCompletedSessionsForFeedback() {
  const response = await sessionsService.getAll();
  return (response?.data || [])
    .filter(row => row.status === 'completed')
    .map(row => ({ id: row.id, topic: row.topic, date: splitDateTime(row.start_time).date }));
}

/** Submits feedback for a completed session (Coder only, enforced server-side) */
export async function submitSessionFeedback(sessionId, data) {
  return await sessionsService.submitFeedback(sessionId, data);
}
