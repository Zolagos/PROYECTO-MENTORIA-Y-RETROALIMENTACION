import {
  loadSessions,
  getSessions,
  getSessionById,
  getTutors,
  getTutorById,
  createSession,
  updateSession,
  deleteSession,
  loadCoders,
  loadSessionDetail,
  assignParticipants
} from '../services/mentoring.js'
import { getMentoringCards } from '../app.js'
import { openModal, closeModal, showToast } from '../utils.js'

export async function initMentoring() {
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
  await loadMentoringSessions();
}

async function loadMentoringSessions() {
  const container = document.getElementById(
    'mentoring-container'
  );

  if (!container) return;

  container.innerHTML = `
    <div class="empty-state">
      <h2 class="empty-state__title">
        Cargando mentorías...
      </h2>
      <p class="empty-state__description">
        Consultando las sesiones disponibles.
      </p>
    </div>
  `;

  try {
    await loadSessions();
    applyMentoringFilters();
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 class="empty-state__title">
          No fue posible cargar las mentorías
        </h2>
        <p class="empty-state__description">
          Verifica que el backend esté disponible e intenta nuevamente.
        </p>
      </div>
    `;

    showToast(
      error.message || 'No fue posible cargar las mentorías.',
      'error'
    );
  }
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

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = String(value ?? '');
  return element.innerHTML;
}

export async function openParticipantsModal(sessionId) {
  const id = Number(sessionId);
  const session = getSessionById(id);

  if (!Number.isInteger(id) || id <= 0 || !session) {
    showToast('La sesión seleccionada no es válida.', 'error');
    return;
  }

  if (session.status !== 'programada') {
    showToast(
      'Solo puedes agregar participantes a sesiones programadas.',
      'error'
    );
    return;
  }

  const idInput = document.getElementById(
    'participants-session-id'
  );
  const sessionLabel = document.getElementById(
    'modal-participants-session'
  );
  const list = document.getElementById('participants-list');
  const submitButton = document.getElementById(
    'participants-submit-btn'
  );

  if (!idInput || !sessionLabel || !list || !submitButton) {
    showToast(
      'No fue posible preparar el formulario de participantes.',
      'error'
    );
    return;
  }

  idInput.value = String(id);
  sessionLabel.textContent = session.topic;

  list.innerHTML = `
    <div class="empty-state">
      <p class="empty-state__description">
        Cargando coders...
      </p>
    </div>
  `;

  submitButton.disabled = true;
  submitButton.textContent = 'Cargando...';

  openModal('modal-participants');

  try {
    const [coders, detail] = await Promise.all([
      loadCoders(),
      loadSessionDetail(id),
    ]);

    const participants = Array.isArray(detail.participants)
      ? detail.participants
      : [];

    const assignedIds = new Set(
      participants
        .map((participant) => Number(participant.id))
        .filter((participantId) =>
          Number.isInteger(participantId)
        )
    );

    if (coders.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <p class="empty-state__description">
            No hay coders activos disponibles en este clan.
          </p>
        </div>
      `;

      submitButton.disabled = true;
      submitButton.textContent = 'Sin coders disponibles';
      return;
    }

    list.innerHTML = coders.map((coder) => {
      const alreadyAssigned = assignedIds.has(coder.id);
      const fullName = escapeHtml(
        coder.fullName || `${coder.name} ${coder.lastname}`
      );

      return `
        <label
          class="card"
          style="
            display:flex;
            align-items:center;
            gap:var(--space-3);
            padding:var(--space-3);
            margin-bottom:var(--space-2);
            cursor:${alreadyAssigned ? 'default' : 'pointer'};
          "
        >
          <input
            type="checkbox"
            name="participant-coder"
            value="${coder.id}"
            ${alreadyAssigned ? 'checked disabled' : ''}
          />

          <span>
            <strong>${fullName}</strong>
            <span
              class="text-sm text-muted"
              style="display:block;"
            >
              ${
                alreadyAssigned
                  ? 'Ya está asignado'
                  : 'Disponible para agregar'
              }
            </span>
          </span>
        </label>
      `;
    }).join('');

    const availableCoders = coders.filter(
      (coder) => !assignedIds.has(coder.id)
    );

    submitButton.disabled = availableCoders.length === 0;
    submitButton.textContent =
      availableCoders.length === 0
        ? 'Todos están asignados'
        : 'Agregar participantes';
  } catch (error) {
    console.error(
      'Error cargando participantes:',
      error
    );

    list.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__description">
          No fue posible cargar los coders.
        </p>
      </div>
    `;

    submitButton.disabled = true;
    submitButton.textContent = 'No disponible';

    showToast(
      error.message || 'No fue posible cargar los coders.',
      'error'
    );
  }
}

export async function submitParticipants() {
  const sessionId = Number(
    document.getElementById('participants-session-id')?.value
  );

  const submitButton = document.getElementById(
    'participants-submit-btn'
  );

  const coderIds = Array.from(
    document.querySelectorAll(
      '#participants-list input[name="participant-coder"]:checked:not(:disabled)'
    )
  ).map((checkbox) => Number(checkbox.value));

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    showToast('La sesión seleccionada no es válida.', 'error');
    return;
  }

  if (coderIds.length === 0) {
    showToast(
      'Selecciona al menos un coder para agregar.',
      'error'
    );
    return;
  }

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Agregando...';
    }

    await assignParticipants(sessionId, coderIds);
    await loadSessions();

    applyMentoringFilters();
    closeModal('modal-participants');

    showToast(
      'Participantes agregados correctamente.',
      'success'
    );
  } catch (error) {
    console.error(
      'Error agregando participantes:',
      error
    );

    showToast(
      error.message ||
        'No fue posible agregar los participantes.',
      'error'
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Agregar participantes';
    }
  }
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
export async function submitMentoring() {
  clearMentoringErrors();

  const topic = document.getElementById('m-topic');
  const tutor = document.getElementById('m-tutor');
  const date = document.getElementById('m-date');
  const startTime = document.getElementById('m-time');
  const endTime = document.getElementById('m-end-time');
  const mentorshipType = document.getElementById(
    'm-mentorship-type'
  );
  const modality = document.getElementById('m-modality');
  const location = document.getElementById('m-location');
  const sessionType = document.getElementById('m-type');
  const description = document.getElementById('m-desc');
  const submitButton = document.getElementById('m-submit-btn');

  let valid = true;

  if (!topic?.value.trim()) {
    topic?.classList.add('form-input--error');
    document
      .getElementById('m-topic-error')
      ?.classList.remove('hidden');
    valid = false;
  }

  if (!tutor?.value) {
    tutor?.classList.add('form-select--error');
    document
      .getElementById('m-tutor-error')
      ?.classList.remove('hidden');
    valid = false;
  }

  if (!date?.value) {
    date?.classList.add('form-input--error');
    document
      .getElementById('m-date-error')
      ?.classList.remove('hidden');
    valid = false;
  }

  if (!startTime?.value || !endTime?.value) {
    showToast(
      'Selecciona la hora de inicio y finalización.',
      'error'
    );
    valid = false;
  }

  if (!valid) return;

  if (!mentorshipType?.value) {
    showToast('Selecciona el tipo de mentoría.', 'error');
    return;
  }

  if (!modality?.value) {
    showToast('Selecciona la modalidad.', 'error');
    return;
  }

  if (!location?.value.trim()) {
    showToast(
      modality.value === 'virtual'
        ? 'El enlace de videoconferencia es obligatorio.'
        : 'La sala física es obligatoria.',
      'error'
    );
    return;
  }

  const parsedStartTime = new Date(
    `${date.value}T${startTime.value}:00`
  );

  const parsedEndTime = new Date(
    `${date.value}T${endTime.value}:00`
  );

  if (
    Number.isNaN(parsedStartTime.getTime()) ||
    Number.isNaN(parsedEndTime.getTime())
  ) {
    showToast('La fecha o las horas no son válidas.', 'error');
    return;
  }

  if (parsedEndTime <= parsedStartTime) {
    showToast(
      'La hora de finalización debe ser posterior a la hora de inicio.',
      'error'
    );
    return;
  }

  const isVirtual = modality.value === 'virtual';

  const payload = {
    topic: topic.value.trim(),
    description: description?.value.trim() || null,
    mentorship_type: mentorshipType.value,
    modality: isVirtual ? 'virtual' : 'in person',
    session_type:
      sessionType?.value === 'abierta' ? 'open' : 'closed',
    room: isVirtual ? null : location.value.trim(),
    meeting_link: isVirtual ? location.value.trim() : null,
    start_time: parsedStartTime.toISOString(),
    end_time: parsedEndTime.toISOString(),
    tutor_id: Number(tutor.value),
  };

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Creando...';
    }

    await createSession(payload);
    await loadSessions();

    applyMentoringFilters();
    closeModal('modal-mentoring');
    resetMentoringForm();

    showToast(
      'Mentoría creada correctamente.',
      'success'
    );
  } catch (error) {
    console.error('Error creando la mentoría:', error);

    showToast(
      error.message || 'No fue posible crear la mentoría.',
      'error'
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Crear Mentoría';
    }
  }
}