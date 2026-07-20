import { sessionsService, usersService } from './api.js';

let sessionsCache = [];
let tutorsCache = [];

function transformSession(raw) {
  const st = raw.start_time || '';
  return {
    id: raw.id,
    topic: raw.topic,
    desc: raw.description,
    tutorId: raw.tutor_id,
    tutor: `${raw.tutor_name || ''} ${raw.tutor_lastname || ''}`.trim(),
    date: st ? st.split('T')[0] : '',
    time: st ? (st.split('T')[1] || '').substring(0, 5) : '',
    modality: raw.modality,
    link: raw.link || '',
    room: raw.room || '',
    type: raw.session_type,
    status: (raw.status || '').replace(/_/g, '-'),
    coders: (raw.coders || []).map(c => `${(c.name || '')[0]}${(c.lastname || '')[0]}`),
    codersDetail: raw.coders || [],
  };
}

export function getSessions() {
  return sessionsCache;
}

export function getSessionById(id) {
  return sessionsCache.find(s => s.id === Number(id)) || null;
}

export function getTutors() {
  return tutorsCache;
}

export function getTutorById(id) {
  return tutorsCache.find(t => t.id === Number(id)) || null;
}

export async function loadSessions() {
  const res = await sessionsService.getAll();
  sessionsCache = (res.data || []).map(transformSession);
  return sessionsCache;
}

export async function loadTutors() {
  const res = await usersService.getAll({ role: 'Tutor' });
  tutorsCache = (res.data || []).map(u => ({
    id: u.id,
    name: `${u.name} ${u.lastname}`.trim(),
  }));
  return tutorsCache;
}

export function createSession(mentoring) {
  sessionsCache.push(mentoring);
}

export function updateSession(mentoring) {
  sessionsCache = sessionsCache.map(m =>
    m.id === mentoring.id ? { ...m, ...mentoring } : m
  );
}

export function deleteSession(id) {
  sessionsCache = sessionsCache.filter(m => m.id !== Number(id));
}
