/**
 * mentoring.js — Interacciones de la página de Mentorías
 * Sprint 2: bind de botones y modal
 * Sprint 3: filtros, búsqueda, edición, eliminación en vivo
 * Sprint 4: fetch real al backend
 *
 * Kevin Mendoza | Frontend Developer
 */

// Se llama desde router.js después de inyectar el HTML
function initMentoring() {
  // Botón "Nueva Mentoría"
  const btnNueva = document.getElementById('btn-nueva-mentoria');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => openModal('modal-mentoring'));
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

  // Búsqueda en tiempo real (Sprint 3 la conecta con datos reales)
  const searchInput = document.getElementById('search-mentoring');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.mentoring-detail-card');
      cards.forEach(card => {
        const topic = card.querySelector('.mentoring-detail-card__topic')?.textContent.toLowerCase() || '';
        card.style.display = topic.includes(query) ? '' : 'none';
      });
    });
  }
}

/** Alterna el menú de acciones de una card */
function toggleActionMenu(btn, id) {
  // Cierra cualquier menú abierto
  document.querySelectorAll('.action-menu__dropdown').forEach(d => d.remove());

  const dropdown = document.createElement('div');
  dropdown.className = 'action-menu__dropdown';
  dropdown.innerHTML = `
    <button class="action-menu__item" onclick="alert('Editar mentoría ${id} — Sprint 3')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Editar
    </button>
    <button class="action-menu__item" onclick="alert('Cambiar estado — Sprint 3')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
      Cambiar estado
    </button>
    <button class="action-menu__item action-menu__item--danger" onclick="alert('Eliminar mentoría ${id} — Sprint 3')">
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

/** Alterna el campo enlace/sala según modalidad */
function toggleModalityField() {
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

/** Envía el formulario de nueva mentoría */
function submitMentoring() {
  const topic  = document.getElementById('m-topic');
  const tutor  = document.getElementById('m-tutor');
  const date   = document.getElementById('m-date');
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

  // TODO Sprint 4: POST /api/mentorias
  closeModal('modal-mentoring');
  showToast('Mentoría creada correctamente. (Sprint 4: se guardará en el backend)', 'success');
}
