/**
 * mentoring.js — Servicio de sesiones de mentoría
 *
 * La fuente de datos real es el backend.
 * Este archivo adapta la respuesta de /api/sessions al formato
 * visual que actualmente utiliza el frontend.
 */

import { fetchAPI } from './api.js';

// Caché en memoria para filtros y renderizado.
// PostgreSQL continúa siendo la fuente real de los datos.
let sessionsCache = [];

// Temporalmente se conservan para el formulario existente.
// La lista real de tutores deberá venir de un endpoint del backend.
const TUTORS = [
  { id: 2, name: 'Ana García' },
  { id: 3, name: 'Carlos López' },
];

const STATUS_MAP = {
  scheduled: 'programada',
  in_progress: 'en-progreso',
  completed: 'completada',
  cancelled: 'cancelada',
};

const MODALITY_MAP = {
  virtual: 'virtual',
  'in person': 'presencial',
};

const SESSION_TYPE_MAP = {
  open: 'abierta',
  closed: 'cerrada',
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function getLocalDateParts(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: '',
      time: '',
      endTime: '',
    };
  }

  return {
    date: [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-'),
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function getInitials(participant) {
  const name = participant?.name || '';
  const lastname = participant?.lastname || '';

  return `${name.charAt(0)}${lastname.charAt(0)}`
    .trim()
    .toUpperCase();
}

/**
 * Adapta una sesión del backend al formato visual existente.
 */
function mapSessionFromApi(session) {
  const start = getLocalDateParts(session.start_time);
  const end = getLocalDateParts(session.end_time);

  const tutorName = [
    session.tutor_name ?? session.tutor?.name,
    session.tutor_lastname ?? session.tutor?.lastname,
  ]
    .filter(Boolean)
    .join(' ');

  const participants = Array.isArray(session.participants)
    ? session.participants
    : [];

  return {
    id: Number(session.id),
    topic: session.topic || 'Mentoría sin título',
    desc: session.description || '',
    tutorId: Number(session.tutor_id),
    tutor: tutorName || 'Tutor no disponible',
    date: start.date,
    time: start.time,
    endTime: end.time,
    modality:
      MODALITY_MAP[session.modality] || session.modality,
    link: session.meeting_link || '',
    sala: session.room || '',
    type:
      SESSION_TYPE_MAP[session.session_type] ||
      session.session_type,
    status:
      STATUS_MAP[session.status] || session.status,
    coders: participants
      .map(getInitials)
      .filter(Boolean),
    participantCount: Number(
      session.participant_count ??
      participants.length ??
      0
    ),
    raw: session,
  };
}

/**
 * Solicita al backend las sesiones visibles para el usuario autenticado.
 */
export async function loadSessions() {
  const response = await fetchAPI('/sessions');

  if (!response || !Array.isArray(response.data)) {
    throw new Error(
      'El servidor devolvió una respuesta de sesiones inválida.'
    );
  }

  sessionsCache = response.data.map(mapSessionFromApi);

  return getSessions();
}

/**
 * Devuelve la caché actual para renderizado y filtros.
 */
export function getSessions() {
  return [...sessionsCache];
}

/**
 * Busca una sesión dentro de la caché actual.
 */
export function getSessionById(id) {
  return sessionsCache.find(
    (session) => session.id === Number(id)
  ) || null;
}

export function getTutors() {
  return [...TUTORS];
}

export function getTutorById(id) {
  return TUTORS.find(
    (tutor) => tutor.id === Number(id)
  ) || null;
}

/**
 * Las escrituras se conectarán en la siguiente etapa.
 * Las acciones están ocultas en la interfaz mientras tanto.
 */
export async function createSession() {
  throw new Error(
    'La creación de mentorías todavía está en integración.'
  );
}

export async function updateSession() {
  throw new Error(
    'La edición de mentorías todavía está en integración.'
  );
}

export async function deleteSession() {
  throw new Error(
    'La cancelación de mentorías todavía está en integración.'
  );
}
