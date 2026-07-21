/**
 * feedback.js — Feedback page interactions
 */
import { getCompletedSessionsForFeedback, submitSessionFeedback } from '../services/mentoring.js';
import { formatDate } from '../utils.js';

export async function initFeedback() {
  const btnNuevo = document.getElementById('btn-new-feedback');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', async () => {
      resetFeedbackForm();
      await populateMentoringSelect();
      openModal('modal-feedback');
    });
  }
}

async function populateMentoringSelect() {
  const select = document.getElementById('fb-mentoring');
  if (!select) return;

  let sessions = [];
  try {
    sessions = await getCompletedSessionsForFeedback();
  } catch {
    sessions = [];
  }

  select.innerHTML = '<option value="">Select completed mentorship...</option>' +
    sessions.map(s => `<option value="${s.id}">${s.topic} — ${formatDate(s.date)}</option>`).join('');
}

function resetFeedbackForm() {
  const form = document.getElementById('form-feedback');
  if (!form) return;
  form.reset();
  document.getElementById('fb-session-rating').value = '0';
  document.getElementById('fb-tutor-rating').value = '0';
  paintStars('session', 0);
  paintStars('tutor', 0);
  clearFeedbackErrors();
}

function clearFeedbackErrors() {
  document.getElementById('fb-mentoring')?.classList.remove('form-select--error');
  document.getElementById('fb-mentoring-error')?.classList.add('hidden');
  document.getElementById('fb-session-rating-error')?.classList.add('hidden');
  document.getElementById('fb-tutor-rating-error')?.classList.add('hidden');
  document.getElementById('fb-comment')?.classList.remove('form-input--error');
  document.getElementById('fb-comment-error')?.classList.add('hidden');
}

function paintStars(group, value) {
  const stars = document.querySelectorAll(`#star-rating-${group} .star-rating__star`);
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
}

/** Sets a star rating for the given group ('session' or 'tutor') */
export function setRating(value, group) {
  const input = document.getElementById(`fb-${group}-rating`);
  if (!input) return;

  input.value = value;
  paintStars(group, value);
  document.getElementById(`fb-${group}-rating-error`)?.classList.add('hidden');
}

/** Submits the feedback form against the backend */
export async function submitFeedback() {
  clearFeedbackErrors();

  const mentoring     = document.getElementById('fb-mentoring');
  const sessionRating = document.getElementById('fb-session-rating');
  const tutorRating    = document.getElementById('fb-tutor-rating');
  const comment        = document.getElementById('fb-comment');
  let valid = true;

  if (!mentoring?.value) {
    mentoring?.classList.add('form-select--error');
    document.getElementById('fb-mentoring-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!sessionRating?.value || sessionRating.value === '0') {
    document.getElementById('fb-session-rating-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!tutorRating?.value || tutorRating.value === '0') {
    document.getElementById('fb-tutor-rating-error')?.classList.remove('hidden');
    valid = false;
  }
  if (!comment?.value.trim()) {
    comment?.classList.add('form-input--error');
    document.getElementById('fb-comment-error')?.classList.remove('hidden');
    valid = false;
  }

  if (!valid) return;

  try {
    await submitSessionFeedback(mentoring.value, {
      tutor_rating: Number(tutorRating.value),
      session_rating: Number(sessionRating.value),
      comments: comment.value.trim(),
    });
    closeModal('modal-feedback');
    showToast('Feedback sent! Thank you for your feedback.', 'success');
  } catch (error) {
    showToast(error.message || 'Could not submit feedback.', 'error');
  }
}
