import { observationsService, coderObservationsService, tutorObservationsService, usersService } from './api.js';

let observationsCache = [];

// ---- OBSERVATION TARGETS (coders + tutors, for the create/edit modal) ----
let targetsCache = { coders: [], tutors: [] };

export function getObservationTargets() {
  return targetsCache;
}

/** Loads coders and tutors available as observation targets */
export async function loadObservationTargets() {
  const [codersRes, tutorsRes] = await Promise.all([
    usersService.getAll({ role: 'Coder' }),
    usersService.getAll({ role: 'Tutor' }),
  ]);
  targetsCache = {
    coders: (codersRes.data || []).map(u => ({ id: u.id, name: `${u.name} ${u.lastname}`.trim() })),
    tutors: (tutorsRes.data || []).map(u => ({ id: u.id, name: `${u.name} ${u.lastname}`.trim() })),
  };
  return targetsCache;
}

function getInitials(name, lastname) {
  return ((name || '')[0] + (lastname || '')[0]).toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function transformObservation(raw) {
  return {
    id: raw.id,
    type: raw.type,
    targetId: raw.target_id,
    observer: `${raw.observer_name || ''} ${raw.observer_lastname || ''}`.trim(),
    target: `${raw.target_name || ''} ${raw.target_lastname || ''}`.trim(),
    initials: getInitials(raw.observer_name, raw.observer_lastname),
    date: formatDate(raw.created_at),
    sessionTopic: raw.session_topic || '',
    observation: raw.observation || '',
    recommendation: raw.recommendation || null,
    technicalNotes: raw.technical_notes || null,
  };
}

export function getObservations() {
  return observationsCache;
}

/** Finds a cached observation by id + type */
export function getObservationById(id, type) {
  return observationsCache.find(o => o.id === Number(id) && o.type === type) || null;
}

export async function loadObservations(filters = {}) {
  const res = await observationsService.getAll(filters);
  observationsCache = (res.data || []).map(transformObservation);
  return observationsCache;
}

/** Creates a coder or tutor observation against the correct endpoint */
export async function createObservation(type, data) {
  const service = type === 'tutor' ? tutorObservationsService : coderObservationsService;
  return await service.create(data);
}

/** Updates a coder or tutor observation against the correct endpoint */
export async function updateObservation(id, type, data) {
  const service = type === 'tutor' ? tutorObservationsService : coderObservationsService;
  return await service.update(id, data);
}

/** Deletes a coder or tutor observation against the correct endpoint */
export async function deleteObservation(id, type) {
  const service = type === 'tutor' ? tutorObservationsService : coderObservationsService;
  return await service.delete(id);
}
