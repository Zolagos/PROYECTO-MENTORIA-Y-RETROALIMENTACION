/**
 * observations.js — Observations page interactions
 * Kevin Mendoza | Frontend Developer
 */

export function initObservations() {
  const btnNueva = document.getElementById('btn-new-observation');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => openModal('modal-observation'));
  }

  const searchInput = document.getElementById('search-obs');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.timeline-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
}

/** Submits the new observation form */
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

  // TODO Sprint 4: POST /api/observations
  closeModal('modal-observation');
  showToast('Observation saved successfully.', 'success');
}
