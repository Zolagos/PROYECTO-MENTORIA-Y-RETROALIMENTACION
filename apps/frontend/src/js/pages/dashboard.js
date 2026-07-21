/**
 * dashboard.js — Dashboard interactions
 * Loads role-scoped summary stats from the backend and fills the stat cards.
 */
import { dashboardService } from '../services/api.js';
import { getSessionUser } from '../components/header.js';

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export async function initDashboard() {
  const role = getSessionUser()?.role;

  let summary;
  try {
    summary = (await dashboardService.getSummary())?.data;
  } catch {
    return;
  }
  if (!summary) return;

  if (role === 'CODER') {
    setText('dash-sessions-month', summary.sessionsThisMonth);
    setText('dash-completed', summary.completed);
    setText('dash-pending', summary.pending);
  } else if (role === 'TUTOR') {
    setText('dash-assigned-coders', summary.assignedCoders);
    setText('dash-active-mentorships', summary.activeMentorships);
    setText('dash-pending-feedbacks', summary.pendingFeedbacks);
  } else if (role === 'TL') {
    setText('dash-total-users', summary.totalUsers);
    setText('dash-completed-mentorships', summary.completedMentorships);
    setText('dash-pending-mentorships', summary.pendingMentorships);
    setText('dash-completion-rate', `${summary.completionRate}%`);
  }
}
