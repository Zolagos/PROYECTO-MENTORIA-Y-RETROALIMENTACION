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
  const storedUser = sessionStorage.getItem('tutorlink_user');

  if (!storedUser) {
    return [...TUTORS];
  }

  try {
    const user = JSON.parse(storedUser);

    if (user.rol === 'TUTOR') {
      return [{
        id: Number(user.id),
        name: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
      }];
    }
  } catch {
    return [...TUTORS];
  }

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
export async function createSession(sessionData) {
  const response = await fetchAPI('/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  });

  if (!response?.data) {
    throw new Error(
      'El servidor devolvió una respuesta inválida al crear la mentoría.'
    );
  }

  return response.data;
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
export async function loadCoders() {
  const response = await fetchAPI(
    `/users?role=${encodeURIComponent('Coder')}`
  );

  if (!Array.isArray(response?.data)) {
    throw new Error(
      'El servidor devolvió una lista de coders inválida.'
    );
  }

  return response.data.map((coder) => ({
    id: Number(coder.id),
    name: coder.name || '',
    lastname: coder.lastname || '',
    fullName: `${coder.name || ''} ${coder.lastname || ''}`.trim(),
    clanId: Number(coder.clan_id),
  }));
}

export async function loadSessionDetail(sessionId) {
  const id = Number(sessionId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('La sesión seleccionada no es válida.');
  }

  const response = await fetchAPI(`/sessions/${id}`);

  if (!response?.data) {
    throw new Error(
      'El servidor devolvió un detalle de sesión inválido.'
    );
  }

  return response.data;
}

export async function assignParticipants(sessionId, coderIds) {
  const id = Number(sessionId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('La sesión seleccionada no es válida.');
  }

  if (!Array.isArray(coderIds) || coderIds.length === 0) {
    throw new Error('Selecciona al menos un participante.');
  }

  const response = await fetchAPI(
    `/sessions/${id}/participants`,
    {
      method: 'POST',
      body: JSON.stringify({ coderIds }),
    }
  );

  if (!response?.data) {
    throw new Error(
      'El servidor devolvió una respuesta inválida al asignar participantes.'
    );
  }

  return response.data;
}