/**
 * feedback.js — Interacciones de la página de Feedback
 * Kevin Mendoza | Frontend Developer
 */

function initFeedback() {
  const btnNuevo = document.getElementById('btn-nuevo-feedback');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => openModal('modal-feedback'));
  }
}

/** Establece la calificación por estrellas */
function setRating(value) {
  const stars = document.querySelectorAll('.star-rating__star');
  const input = document.getElementById('fb-rating');
  if (!stars.length || !input) return;

  input.value = value;

  stars.forEach((star, i) => {
    if (i < value) {
      star.classList.add('filled');
      star.setAttribute('fill', 'currentColor');
      star.setAttribute('aria-checked', 'true');
    } else {
      star.classList.remove('filled');
      star.setAttribute('fill', 'none');
      star.setAttribute('aria-checked', 'false');
    }
  });

  // Limpia error de rating si existía
  document.getElementById('fb-rating-error')?.classList.add('hidden');
}

/** Envía el formulario de feedback */
function submitFeedback() {
  const mentoring = document.getElementById('fb-mentoring');
  const rating    = document.getElementById('fb-rating');
  const comment   = document.getElementById('fb-comment');
  let valid = true;

  if (!mentoring?.value) {
    mentoring?.classList.add('form-select--error');
    document.getElementById('fb-mentoring-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!rating?.value || rating.value === '0') {
    document.getElementById('fb-rating-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!comment?.value.trim()) {
    comment?.classList.add('form-input--error');
    document.getElementById('fb-comment-error')?.classList.remove('hidden');
    valid = false;
  }

  if (!valid) return;

  // TODO Sprint 4: POST /api/feedback
  closeModal('modal-feedback');
  showToast('¡Feedback enviado! Gracias por tu retroalimentación.', 'success');
}
