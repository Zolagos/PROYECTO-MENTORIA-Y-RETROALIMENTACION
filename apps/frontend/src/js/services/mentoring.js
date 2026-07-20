/**
 * mentoring.js — Servicio de datos de Mentorías
 *
 * ¿Qué hace?
 * Maneja el CRUD de mentorías (crear, listar, editar, eliminar).
 * Por ahora persiste en localStorage con los mismos datos de muestra
 * del diseño, para que la vista funcione de punta a punta sin backend.
 *
 * ¿Por qué así?
 * Las mentorías usan la MISMA estructura que las cards de app.js
 * (topic, desc, tutor, date, time, modality, link/sala, status, coders),
 * así la vista no cambia. Sprint 4: cada función se reemplaza por su
 * fetch al backend manteniendo la misma firma.
 */

// ---- CLAVE DE ALMACENAMIENTO ----
const MENTORING_STORAGE_KEY = 'tutorcode_mentoring';

// ---- TUTORES DISPONIBLES ----
// Sprint 4: vendrán de GET /api/users?role=tutor
const TUTORS = [
  { id: 1, name: 'Ana García' },
  { id: 2, name: 'Carlos López' },
  { id: 3, name: 'María Torres' },
];

// ---- DATOS DE MUESTRA ----
// date en formato ISO (YYYY-MM-DD) y time en 24h (HH:MM) para que
// funcionen directo en los inputs del modal; la card los muestra
// formateados con formatDate() de utils.js
const MENTORING_SAMPLE = [
  { id:1, topic:'JavaScript Avanzado', desc:'Closures, promesas y async/await en profundidad.', tutorId:1, tutor:'Ana García', date:'2026-07-15', time:'10:00', modality:'virtual', link:'meet.google.com/abc', sala:'', type:'abierta', status:'programada', coders:['KM','JP','LC'] },
  { id:2, topic:'Bases de Datos SQL', desc:'Normalización hasta 3FN, joins y consultas complejas.', tutorId:2, tutor:'Carlos López', date:'2026-07-16', time:'14:00', modality:'presencial', link:'', sala:'Sala A-101', type:'cerrada', status:'completada', coders:['MR','SV'] },
  { id:3, topic:'Git y GitHub Flow', desc:'Ramas, pull requests y resolución de conflictos.', tutorId:3, tutor:'María Torres', date:'2026-07-17', time:'09:00', modality:'virtual', link:'zoom.us/j/123', sala:'', type:'abierta', status:'en-progreso', coders:['DG','RP','KM','AB'] },
];

/** Devuelve los tutores disponibles para el select del modal */
export function getTutors() {
  return TUTORS;
}

/** Busca un tutor por id */
export function getTutorById(id) {
  return TUTORS.find(t => t.id === Number(id)) || null;
}

/** Devuelve todas las mentorías (siembra los datos de muestra la primera vez) */
export function getSessions() {
  const data = localStorage.getItem(MENTORING_STORAGE_KEY);
  if (data) return JSON.parse(data);

  localStorage.setItem(MENTORING_STORAGE_KEY, JSON.stringify(MENTORING_SAMPLE));
  return MENTORING_SAMPLE;
}

/** Busca una mentoría por id */
export function getSessionById(id) {
  return getSessions().find(m => m.id === Number(id)) || null;
}

/** Guarda la lista completa en localStorage */
function saveSessions(sessions) {
  localStorage.setItem(MENTORING_STORAGE_KEY, JSON.stringify(sessions));
}

/** Crea una mentoría nueva */
export function createSession(mentoring) {
  const sessions = getSessions();

  mentoring.id = Date.now();
  mentoring.status = mentoring.status || 'schedulled';
  mentoring.coders = mentoring.coders || [];

  sessions.push(mentoring);
  saveSessions(sessions);
}

/** Actualiza una mentoría existente (conserva los campos no editados) */
export function updateSession(mentoring) {
  const sessions = getSessions().map(m =>
    m.id === mentoring.id ? { ...m, ...mentoring } : m
  );
  saveSessions(sessions);
}

/** Elimina una mentoría por id */
export function deleteSession(id) {
  const sessions = getSessions().filter(m => m.id !== Number(id));
  saveSessions(sessions);
}
