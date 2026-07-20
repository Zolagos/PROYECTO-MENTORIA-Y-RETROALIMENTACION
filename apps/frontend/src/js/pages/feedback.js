/**
 * feedback.js — Feedback page interactions
 * Kevin Mendoza | Frontend Developer
 */

export function initFeedback() {
  const btnNuevo = document.getElementById('btn-new-feedback');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => openModal('modal-feedback'));
  }
}

/** Sets the star rating */
export function setRating(value) {
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

  // Clears the rating error if it existed
  document.getElementById('fb-rating-error')?.classList.add('hidden');
}

/** Submits the feedback form */
export function submitFeedback() {
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
  showToast('Feedback sent! Thank you for your feedback.', 'success');
}
