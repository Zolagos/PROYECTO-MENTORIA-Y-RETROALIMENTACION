import { observationsService } from './api.js';

let observationsCache = [];

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

export async function loadObservations() {
  const res = await observationsService.getAll();
  observationsCache = (res.data || []).map(transformObservation);
  return observationsCache;
}
