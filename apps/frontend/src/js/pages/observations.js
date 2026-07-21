import {
  loadObservations, getObservations, getObservationById,
  loadObservationTargets, getObservationTargets,
  createObservation, updateObservation, deleteObservation,
} from '../services/observations.js';
import { getObservationsTimeline } from '../app.js';
import { getSessionUser } from '../components/header.js';

function renderTimeline() {
  const container = document.getElementById('observations-timeline');
  if (!container) return;
  container.innerHTML = getObservationsTimeline();
  applyFilters();
}

function applyFilters() {
  const query = (document.getElementById('search-obs')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('filter-obs-type')?.value || '';

  document.querySelectorAll('.timeline-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    const type = item.dataset.type || '';
    const matchesSearch = !query || text.includes(query);
    const matchesType = !typeFilter || type === typeFilter;
    item.style.display = matchesSearch && matchesType ? '' : 'none';
  });
}

/** Populates the obs-target select with coders (and tutors, if the user is a Team Leader) */
function populateTargetSelect() {
  const select = document.getElementById('obs-target');
  if (!select) return;

  const role = getSessionUser()?.role;
  const { coders, tutors } = getObservationTargets();

  const coderOptions = coders.map(c => `<option value="coder:${c.id}">${c.name} (Coder)</option>`).join('');
  // Tutors can only observe coders — creating a tutor observation is Team Leader only.
  const tutorOptions = role === 'TL'
    ? tutors.map(t => `<option value="tutor:${t.id}">${t.name} (Tutor)</option>`).join('')
    : '';

  select.innerHTML = '<option value="">Select person...</option>' + coderOptions + tutorOptions;
}

/** Shows the technical-notes field only when the selected target is a tutor */
function toggleTechnicalNotesField() {
  const target = document.getElementById('obs-target')?.value || '';
  const group = document.getElementById('obs-technical-notes-group');
  if (group) group.style.display = target.startsWith('tutor:') ? '' : 'none';
}

export async function initObservations() {
  const btnNueva = document.getElementById('btn-new-observation');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      resetObservationForm();
      openModal('modal-observation');
    });
  }

  await loadObservationTargets();
  populateTargetSelect();

  const targetSelect = document.getElementById('obs-target');
  if (targetSelect) targetSelect.addEventListener('change', toggleTechnicalNotesField);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  await loadObservations(sessionId ? { session_id: sessionId } : {});
  renderTimeline();

  const searchInput = document.getElementById('search-obs');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  const typeSelect = document.getElementById('filter-obs-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilters);
  }
}

/** Leaves the modal form in create mode */
function resetObservationForm() {
  const form = document.getElementById('form-observation');
  if (!form) return;

  form.reset();
  document.getElementById('obs-id').value = '';
  document.getElementById('obs-target').disabled = false;
  document.getElementById('modal-obs-title').textContent = 'New Observation';
  document.getElementById('obs-submit-btn').textContent = 'Save';
  toggleTechnicalNotesField();
  clearObservationErrors();
}

function clearObservationErrors() {
  document.getElementById('obs-target')?.classList.remove('form-select--error');
  document.getElementById('obs-text')?.classList.remove('form-input--error');
  document.getElementById('obs-target-error')?.classList.add('hidden');
  document.getElementById('obs-text-error')?.classList.add('hidden');
}

/** Opens the modal in edit mode with an existing observation's data */
export function editObservationItem(id, type) {
  const item = getObservationById(id, type);
  if (!item) return;

  resetObservationForm();
  document.getElementById('obs-id').value = item.id;
  document.getElementById('obs-target').value = `${type}:${item.targetId}`;
  document.getElementById('obs-target').disabled = true;
  document.getElementById('obs-text').value = item.observation;
  document.getElementById('obs-recommendation').value = item.recommendation || '';
  document.getElementById('obs-technical-notes').value = item.technicalNotes || '';
  toggleTechnicalNotesField();

  document.getElementById('modal-obs-title').textContent = 'Edit Observation';
  document.getElementById('obs-submit-btn').textContent = 'Save Changes';

  openModal('modal-observation');
}

/** Deletes an observation after confirmation (Team Leader only, enforced server-side) */
export async function deleteObservationItem(id, type) {
  const item = getObservationById(id, type);
  if (!item) return;

  if (!confirm('Delete this observation?')) return;

  try {
    await deleteObservation(id, type);
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    await loadObservations(sessionId ? { session_id: sessionId } : {});
    renderTimeline();
    showToast('Observation deleted.', 'success');
  } catch (error) {
    showToast(error.message || 'Could not delete the observation.', 'error');
  }
}

export async function submitObservation() {
  clearObservationErrors();

  const target = document.getElementById('obs-target');
  const text   = document.getElementById('obs-text');
  let valid = true;

  if (!target?.value) {
    target?.classList.add('form-select--error');
    document.getElementById('obs-target-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!text?.value.trim()) {
    text?.classList.add('form-input--error');
    document.getElementById('obs-text-error')?.classList.remove('hidden');
    valid = false;
  }

  if (!valid) return;

  const [type, targetId] = target.value.split(':');
  const id = document.getElementById('obs-id').value;
  const recommendation = document.getElementById('obs-recommendation').value.trim();
  const technicalNotes = document.getElementById('obs-technical-notes').value.trim();

  const payload = type === 'tutor'
    ? {
        tutor_id: Number(targetId),
        observation: text.value.trim(),
        recommendation: recommendation || null,
        technical_notes: technicalNotes || null,
      }
    : {
        coder_id: Number(targetId),
        observation: text.value.trim(),
        recommendation: recommendation || null,
      };

  try {
    if (id) {
      await updateObservation(id, type, payload);
      showToast('Observation updated successfully.', 'success');
    } else {
      await createObservation(type, payload);
      showToast('Observation saved successfully.', 'success');
    }

    closeModal('modal-observation');
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    await loadObservations(sessionId ? { session_id: sessionId } : {});
    renderTimeline();
  } catch (error) {
    showToast(error.message || 'Could not save the observation.', 'error');
  }
}
