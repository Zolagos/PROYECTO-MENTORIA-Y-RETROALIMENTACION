import {
  getSessions, getSessionById,
  getTutors, getTutorById,
  createSession, updateSession, deleteSession
} from '../services/mentoring.js'
import { getMentoringCards } from '../app.js'
import { openModal, closeModal, showToast } from '../utils.js'

export function initMentoring() {
  // Botón "Nueva Mentoría" — abre el modal en modo crear
  const btnNueva = document.getElementById('btn-nueva-mentoria');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      resetMentoringForm();
      openModal('modal-mentoring');
    });
  }

  // Toggle de vista grid / lista
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

  // Búsqueda y filtros en vivo
  const searchInput = document.getElementById('search-mentoring');
  const filterEstado = document.getElementById('filter-estado');
  const filterModalidad = document.getElementById('filter-modalidad');

  if (searchInput) searchInput.addEventListener('input', applyMentoringFilters);
  if (filterEstado) filterEstado.addEventListener('change', applyMentoringFilters);
  if (filterModalidad) filterModalidad.addEventListener('change', applyMentoringFilters);
}

/** Vuelve a pintar las cards respetando búsqueda y filtros activos */
export function refreshMentoringCards() {
  applyMentoringFilters();
}

/** Filtra las mentorías por búsqueda, estado y modalidad */
export function applyMentoringFilters() {
  const container = document.getElementById('mentoring-container');
  if (!container) return;

  const query = (document.getElementById('search-mentoring')?.value || '').toLowerCase();
  const estado = document.getElementById('filter-estado')?.value || '';
  const modalidad = document.getElementById('filter-modalidad')?.value || '';

  const filtered = getSessions().filter(m => {
    const matchesQuery = !query || m.topic.toLowerCase().includes(query);
    const matchesEstado = !estado || m.status === estado;
    const matchesModalidad = !modalidad || m.modality === modalidad;
    return matchesQuery && matchesEstado && matchesModalidad;
  });

  container.innerHTML = getMentoringCards(filtered);
}

/** Alterna el menú de acciones de una card */
export function toggleActionMenu(btn, id) {
  // Cierra cualquier menú abierto
  document.querySelectorAll('.action-menu__dropdown').forEach(d => d.remove());

  const dropdown = document.createElement('div');
  dropdown.className = 'action-menu__dropdown';
  dropdown.innerHTML = `
    <button class="action-menu__item" onclick="editMentoring(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Editar
    </button>
    <button class="action-menu__item" onclick="changeMentoringStatus(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
      Cambiar estado
    </button>
    <button class="action-menu__item action-menu__item--danger" onclick="deleteMentoring(${id})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      Eliminar
    </button>
  `;

  btn.parentElement.appendChild(dropdown);

  // Cierra al hacer click fuera
  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.remove();
        document.removeEventListener('click', close);
      }
    });
  }, 0);
}

/** Abre el modal en modo edición con los datos de la mentoría */
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
    mentoring.modality === 'virtual' ? (mentoring.link || '') : (mentoring.sala || '');
  document.getElementById('m-type').value = mentoring.type || 'abierta';
  document.getElementById('m-desc').value = mentoring.desc || '';

  // Modo edición: cambia título y texto del botón
  document.getElementById('modal-mentoring-title').textContent = 'Editar Mentoría';
  document.getElementById('m-submit-btn').textContent = 'Guardar Cambios';

  openModal('modal-mentoring');
}

/** Avanza el estado: programada → en-progreso → completada */
export function changeMentoringStatus(id) {
  const mentoring = getSessionById(id);
  if (!mentoring) return;

  const next = { 'programada': 'en-progreso', 'en-progreso': 'completada' };

  if (!next[mentoring.status]) {
    showToast('Esta mentoría ya está finalizada.', 'info');
    return;
  }

  mentoring.status = next[mentoring.status];
  updateSession(mentoring);
  refreshMentoringCards();
  showToast(`Mentoría ahora en estado: ${mentoring.status}.`, 'success');
}

/** Elimina una mentoría previa confirmación */
export function deleteMentoring(id) {
  const mentoring = getSessionById(id);
  if (!mentoring) return;

  if (!confirm(`¿Eliminar la mentoría "${mentoring.topic}"?`)) return;

  deleteSession(id);
  refreshMentoringCards();
  showToast('Mentoría eliminada.', 'success');
}

/** Deja el formulario del modal en modo crear */
function resetMentoringForm() {
  const form = document.getElementById('form-mentoring');
  if (!form) return;

  form.reset();
  document.getElementById('m-id').value = '';
  document.getElementById('modal-mentoring-title').textContent = 'Nueva Mentoría';
  document.getElementById('m-submit-btn').textContent = 'Crear Mentoría';
  clearMentoringErrors();
}

/** Limpia las marcas de error del formulario */
function clearMentoringErrors() {
  document.getElementById('m-topic')?.classList.remove('form-input--error');
  document.getElementById('m-tutor')?.classList.remove('form-select--error');
  document.getElementById('m-date')?.classList.remove('form-input--error');
  document.getElementById('m-topic-error')?.classList.add('hidden');
  document.getElementById('m-tutor-error')?.classList.add('hidden');
  document.getElementById('m-date-error')?.classList.add('hidden');
}

/** Alterna el campo enlace/sala según modalidad */
export function toggleModalityField() {
  const modality = document.getElementById('m-modality')?.value;
  const label = document.getElementById('m-location-label');
  const input = document.getElementById('m-location');
  if (!label || !input) return;

  if (modality === 'virtual') {
    label.textContent = 'Enlace de videoconferencia';
    input.placeholder = 'meet.google.com/... o zoom.us/...';
  } else if (modality === 'presencial') {
    label.textContent = 'Sala física';
    input.placeholder = 'Ej: Sala A-101';
  }
}

/** Envía el formulario de crear/editar mentoría */
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
    showToast('Selecciona la modalidad.', 'error');
    return;
  }

  // La ubicación depende de la modalidad (regla de US-04)
  if (!location?.value.trim()) {
    showToast(
      modality.value === 'virtual'
        ? 'El enlace de videoconferencia es obligatorio.'
        : 'La sala física es obligatoria.',
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
    sala: modality.value === 'presencial' ? location.value.trim() : '',
    type: document.getElementById('m-type')?.value || 'abierta',
  };

  if (id) {
    mentoring.id = id;
    updateSession(mentoring);
    showToast('Mentoría actualizada correctamente.', 'success');
  } else {
    createSession(mentoring);
    showToast('Mentoría creada correctamente.', 'success');
  }

  closeModal('modal-mentoring');
  resetMentoringForm();
  refreshMentoringCards();
}
