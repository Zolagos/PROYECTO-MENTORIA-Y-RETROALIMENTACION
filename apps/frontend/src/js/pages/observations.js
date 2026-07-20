import { loadObservations, getObservations } from '../services/observations.js';
import { getObservationsTimeline } from '../app.js';

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

export async function initObservations() {
  const btnNueva = document.getElementById('btn-new-observation');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => openModal('modal-observation'));
  }

  await loadObservations();
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

export function submitObservation() {
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

  closeModal('modal-observation');
  showToast('Observation saved successfully.', 'success');
}
