import {
  getSessions, getSessionById,
  getTutors, getTutorById,
  createSession, updateSession, deleteSession,
  loadSessions, loadTutors,
} from '../services/mentoring.js'
import { getMentoringCards } from '../app.js'
import { openModal, closeModal, showToast } from '../utils.js'

export async function initMentoring() {
  // 1. Fetch sessions and tutors from the API in parallel
  await Promise.all([loadSessions(), loadTutors()]);

  // 2. Populate the tutor select in the modal
  const tutorSelect = document.getElementById('m-tutor');
  if (tutorSelect) {
    tutorSelect.innerHTML = '<option value="">Select tutor...</option>' +
      getTutors().map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  }

  // 3. Render the session cards
  refreshMentoringCards();

  // 4. "New Mentorship" button — opens the modal in create mode
  const btnNueva = document.getElementById('btn-new-mentoring');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      resetMentoringForm();
      openModal('modal-mentoring');
    });
  }

  // 5. Grid / list view toggle
  const btnGrid = document.getElementById('view-grid');
  const btnList = document.getElementById('view-list');
  const container = document.getElementById('mentoring-container');

  if (btnGrid && btnList && container) {
    btnGrid.addEventListener('click', () => {
      container.classList.remove('mentoring-list-view');
      container.className = 'mentoring-grid';
      btnGrid.classList.add('active');
      btnList.classList.remove('active');
      btnGrid.setAttribute('aria-pressed', 'true');
      btnList.setAttribute('aria-pressed', 'false');
    });

    btnList.addEventListener('click', () => {
      container.className = 'mentoring-list-view';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = 'var(--space-3)';
      btnList.classList.add('active');
      btnGrid.classList.remove('active');
      btnList.setAttribute('aria-pressed', 'true');
      btnGrid.setAttribute('aria-pressed', 'false');
    });
  }

  // 6. Live search and filters
  const searchInput = document.getElementById('search-mentoring');
  const filterStatus = document.getElementById('filter-status');
  const filterModality = document.getElementById('filter-modality');

  if (searchInput) searchInput.addEventListener('input', applyMentoringFilters);
  if (filterStatus) filterStatus.addEventListener('change', applyMentoringFilters);
  if (filterModality) filterModality.addEventListener('change', applyMentoringFilters);
}

/** Repaints the cards respecting the active search and filters */
export function refreshMentoringCards() {
  applyMentoringFilters();
}

/** Filters the mentorships by search, status and modality */
export function applyMentoringFilters() {
  const container = document.getElementById('mentoring-container');
  if (!container) return;

  const query = (document.getElementById('search-mentoring')?.value || '').toLowerCase();
  const status = document.getElementById('filter-status')?.value || '';
  const modality = document.getElementById('filter-modality')?.value || '';

  const filtered = getSessions().filter(m => {
    const matchesQuery = !query || m.topic.toLowerCase().includes(query);
    const matchesStatus = !status || m.status === status;
    const matchesModality = !modality || m.modality === modality;
    return matchesQuery && matchesStatus && matchesModality;
  });

  container.innerHTML = getMentoringCards(filtered);
}

/** Toggles the actions menu for a card */
export function toggleActionMenu(btn, id) {
  // Closes any open menu
  document.querySelectorAll('.action-menu__dropdown').forEach(d => d.remove());

  const dropdown = document.createElement('div');
  dropdown.className = 'action-menu__dropdown';
  dropdown.innerHTML = `
    <button class="action-menu__item" onclick="editMentoring(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Edit
    </button>
    <button class="action-menu__item" onclick="changeMentoringStatus(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
      Change status
    </button>
    <button class="action-menu__item action-menu__item--danger" onclick="deleteMentoring(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      Delete
    </button>
  `;

  btn.parentElement.appendChild(dropdown);

  // Closes when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.remove();
        document.removeEventListener('click', close);
      }
    });
  }, 0);
}

/** Opens the modal in edit mode with the mentorship's data */
export function editMentoring(id) {
  const mentoring = getSessionById(id);
  if (!mentoring) return;

  document.getElementById('m-id').value = mentoring.id;
  document.getElementById('m-topic').value = mentoring.topic;
  document.getElementById('m-tutor').value = mentoring.tutorId || '';
  document.getElementById('m-date').value = mentoring.date;
  document.getElementById('m-time').value = mentoring.time;
  document.getElementById('m-modality').value = mentoring.modality;
  toggleModalityField();
  document.getElementById('m-location').value =
    mentoring.modality === 'virtual' ? (mentoring.link || '') : (mentoring.room || '');
  document.getElementById('m-type').value = mentoring.type || 'open';
  document.getElementById('m-desc').value = mentoring.desc || '';

  // Edit mode: changes title and button text
  document.getElementById('modal-mentoring-title').textContent = 'Edit Mentorship';
  document.getElementById('m-submit-btn').textContent = 'Save Changes';

  openModal('modal-mentoring');
}

/** Advances the status: scheduled → in-progress → completed */
export function changeMentoringStatus(id) {
  const mentoring = getSessionById(id);
  if (!mentoring) return;

  const next = { 'scheduled': 'in-progress', 'in-progress': 'completed' };

  if (!next[mentoring.status]) {
    showToast('This mentorship is already finished.', 'info');
    return;
  }

  mentoring.status = next[mentoring.status];
  updateSession(mentoring);
  refreshMentoringCards();
  showToast(`Mentorship now in status: ${mentoring.status}.`, 'success');
}

/** Opens a unified modal showing the tutor first, then participants */
export function openParticipantsModal(id) {
  const session = getSessionById(id);
  if (!session) return;
  if (!session.tutorDetail && !session.codersDetail.length) return;

  const existing = document.getElementById('modal-participants');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.id = 'modal-participants';
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div class="modal modal--sm">
      <div class="modal__header">
        <h2 class="modal__title">Session members</h2>
        <button class="modal__close" onclick="closeParticipantsModal()" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal__body">
        ${session.tutorDetail
          ? `<div style="margin-bottom:var(--space-3);padding-bottom:var(--space-3);border-bottom:1px solid var(--color-border);">
               <p style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin:0 0 var(--space-1);">TUTOR</p>
               <div style="display:flex;justify-content:space-between;align-items:center;">
                 <span style="font-weight:600;">${session.tutorDetail.name} ${session.tutorDetail.lastname}</span>
                 <span class="badge badge--role-tutor">${session.tutorDetail.role}</span>
               </div>
             </div>`
          : ''
        }
        ${session.codersDetail.length === 0
          ? '<p class="text-muted">No participants assigned.</p>'
          : `<p style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin:0 0 var(--space-1);">PARTICIPANTS</p>
             <ul style="list-style:none;padding:0;margin:0;">
               ${session.codersDetail.map(c => `
                 <li style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border);">
                   <span>${c.name} ${c.lastname}</span>
                   <span class="badge badge--role-${c.role.toLowerCase().replace(/\s+/g, '-')}">${c.role}</span>
                 </li>
               `).join('')}
             </ul>`
        }
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const escHandler = (e) => {
    if (e.key === 'Escape') { closeParticipantsModal(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeParticipantsModal(); });
}

export function closeParticipantsModal() {
  const overlay = document.getElementById('modal-participants');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}

/** Deletes a mentorship after confirmation */
export function deleteMentoring(id) {
  const mentoring = getSessionById(id);
  if (!mentoring) return;

  if (!confirm(`Delete the mentorship "${mentoring.topic}"?`)) return;

  deleteSession(id);
  refreshMentoringCards();
  showToast('Mentorship deleted.', 'success');
}

/** Leaves the modal form in create mode */
function resetMentoringForm() {
  const form = document.getElementById('form-mentoring');
  if (!form) return;

  form.reset();
  document.getElementById('m-id').value = '';
  document.getElementById('modal-mentoring-title').textContent = 'New Mentorship';
  document.getElementById('m-submit-btn').textContent = 'Create Mentorship';
  clearMentoringErrors();
}

/** Clears the form's error marks */
function clearMentoringErrors() {
  document.getElementById('m-topic')?.classList.remove('form-input--error');
  document.getElementById('m-tutor')?.classList.remove('form-select--error');
  document.getElementById('m-date')?.classList.remove('form-input--error');
  document.getElementById('m-topic-error')?.classList.add('hidden');
  document.getElementById('m-tutor-error')?.classList.add('hidden');
  document.getElementById('m-date-error')?.classList.add('hidden');
}

/** Toggles the link/room field based on modality */
export function toggleModalityField() {
  const modality = document.getElementById('m-modality')?.value;
  const label = document.getElementById('m-location-label');
  const input = document.getElementById('m-location');
  if (!label || !input) return;

  if (modality === 'virtual') {
    label.textContent = 'Video conference link';
    input.placeholder = 'meet.google.com/... or zoom.us/...';
  } else if (modality === 'in-person') {
    label.textContent = 'Physical room';
    input.placeholder = 'E.g: Room A-101';
  }
}

/** Submits the create/edit mentorship form */
export function submitMentoring() {
  clearMentoringErrors();

  const topic    = document.getElementById('m-topic');
  const tutor    = document.getElementById('m-tutor');
  const date     = document.getElementById('m-date');
  const time     = document.getElementById('m-time');
  const modality = document.getElementById('m-modality');
  const location = document.getElementById('m-location');
  let valid = true;

  if (!topic?.value.trim()) {
    topic.classList.add('form-input--error');
    document.getElementById('m-topic-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!tutor?.value) {
    tutor.classList.add('form-select--error');
    document.getElementById('m-tutor-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!date?.value) {
    date.classList.add('form-input--error');
    document.getElementById('m-date-error')?.classList.remove('hidden');
    valid = false;
  }

  if (!valid) return;

  if (!modality?.value) {
    showToast('Select the modality.', 'error');
    return;
  }

  // The location depends on the modality (US-04 rule)
  if (!location?.value.trim()) {
    showToast(
      modality.value === 'virtual'
        ? 'The video conference link is required.'
        : 'The physical room is required.',
      'error'
    );
    return;
  }

  const id = Number(document.getElementById('m-id').value);
  const selectedTutor = getTutorById(tutor.value);

  const mentoring = {
    topic: topic.value.trim(),
    desc: document.getElementById('m-desc').value.trim(),
    tutorId: Number(tutor.value),
    tutor: selectedTutor ? selectedTutor.name : '—',
    date: date.value,
    time: time?.value || '',
    modality: modality.value,
    link: modality.value === 'virtual' ? location.value.trim() : '',
    room: modality.value === 'in-person' ? location.value.trim() : '',
    type: document.getElementById('m-type')?.value || 'open',
  };

  if (id) {
    mentoring.id = id;
    updateSession(mentoring);
    showToast('Mentorship updated successfully.', 'success');
  } else {
    createSession(mentoring);
    showToast('Mentorship created successfully.', 'success');
  }

  closeModal('modal-mentoring');
  resetMentoringForm();
  refreshMentoringCards();
}
