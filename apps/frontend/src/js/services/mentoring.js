/**
 * mentoring.js — Mentoring data service
 *
 * What does it do?
 * Handles mentorship CRUD (create, list, edit, delete).
 * For now it persists to localStorage with the same sample data
 * from the design, so the view works end-to-end without a backend.
 *
 * Why this way?
 * Mentorships use the SAME structure as the cards in app.js
 * (topic, desc, tutor, date, time, modality, link/room, status, coders),
 * so the view doesn't change. Sprint 4: each function is replaced by its
 * backend fetch while keeping the same signature.
 */

// ---- STORAGE KEY ----
const MENTORING_STORAGE_KEY = 'tutorcode_mentoring';

// ---- AVAILABLE TUTORS ----
// Sprint 4: will come from GET /api/users?role=tutor
const TUTORS = [
  { id: 1, name: 'Ana García' },
  { id: 2, name: 'Carlos López' },
  { id: 3, name: 'María Torres' },
];

// ---- SAMPLE DATA ----
// date in ISO format (YYYY-MM-DD) and time in 24h (HH:MM) so they
// work directly in the modal inputs; the card shows them
// formatted with formatDate() from utils.js
const MENTORING_SAMPLE = [
  { id:1, topic:'Advanced JavaScript', desc:'Closures, promises and async/await in depth.', tutorId:1, tutor:'Ana García', date:'2026-07-15', time:'10:00', modality:'virtual', link:'meet.google.com/abc', room:'', type:'open', status:'scheduled', coders:['KM','JP','LC'] },
  { id:2, topic:'SQL Databases', desc:'Normalization up to 3NF, joins and complex queries.', tutorId:2, tutor:'Carlos López', date:'2026-07-16', time:'14:00', modality:'in-person', link:'', room:'Room A-101', type:'closed', status:'completed', coders:['MR','SV'] },
  { id:3, topic:'Git and GitHub Flow', desc:'Branches, pull requests and conflict resolution.', tutorId:3, tutor:'María Torres', date:'2026-07-17', time:'09:00', modality:'virtual', link:'zoom.us/j/123', room:'', type:'open', status:'in-progress', coders:['DG','RP','KM','AB'] },
];

/** Returns the available tutors for the modal select */
export function getTutors() {
  return TUTORS;
}

/** Finds a tutor by id */
export function getTutorById(id) {
  return TUTORS.find(t => t.id === Number(id)) || null;
}

/** Returns all mentorships (seeds the sample data the first time) */
export function getSessions() {
  const data = localStorage.getItem(MENTORING_STORAGE_KEY);
  if (data) return JSON.parse(data);

  localStorage.setItem(MENTORING_STORAGE_KEY, JSON.stringify(MENTORING_SAMPLE));
  return MENTORING_SAMPLE;
}

/** Finds a mentorship by id */
export function getSessionById(id) {
  return getSessions().find(m => m.id === Number(id)) || null;
}

/** Saves the full list to localStorage */
function saveSessions(sessions) {
  localStorage.setItem(MENTORING_STORAGE_KEY, JSON.stringify(sessions));
}

/** Creates a new mentorship */
export function createSession(mentoring) {
  const sessions = getSessions();

  mentoring.id = Date.now();
  mentoring.status = mentoring.status || 'scheduled';
  mentoring.coders = mentoring.coders || [];

  sessions.push(mentoring);
  saveSessions(sessions);
}

/** Updates an existing mentorship (keeps unedited fields) */
export function updateSession(mentoring) {
  const sessions = getSessions().map(m =>
    m.id === mentoring.id ? { ...m, ...mentoring } : m
  );
  saveSessions(sessions);
}

/** Deletes a mentorship by id */
export function deleteSession(id) {
  const sessions = getSessions().filter(m => m.id !== Number(id));
  saveSessions(sessions);
}
