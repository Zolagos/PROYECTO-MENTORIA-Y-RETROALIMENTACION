/**
 * metrics.js — Metrics page interactions (Team Leader only)
 */
import { dashboardService } from '../services/api.js';

const STATUS_LABELS = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const MODALITY_LABELS = {
  virtual: 'Virtual',
  'in person': 'In-person',
};

function renderBreakdown(containerId, rows, labels, total) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!rows.length) {
    container.innerHTML = '<p class="empty-state__description">No data yet.</p>';
    return;
  }

  container.innerHTML = rows.map(row => {
    const key = row.status || row.modality;
    const label = labels[key] || key;
    const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
    return `
      <div>
        <div class="flex justify-between text-sm" style="margin-bottom:6px;">
          <span style="color:var(--color-text-secondary);">${label}</span>
          <span style="font-weight:600;">${row.count}</span>
        </div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${pct}%;"></div></div>
      </div>`;
  }).join('');
}

export async function initMetrics() {
  let metrics;
  try {
    metrics = (await dashboardService.getMetrics())?.data;
  } catch {
    return;
  }
  if (!metrics) return;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('metric-total', metrics.totalMentorships);
  setText('metric-completion-rate', `${metrics.completionRate}%`);
  setText('metric-avg-rating', metrics.averageRating.toFixed(1));
  setText('metric-active-coders', metrics.activeCoders);

  renderBreakdown('metric-by-status', metrics.byStatus, STATUS_LABELS, metrics.totalMentorships);
  renderBreakdown('metric-by-modality', metrics.byModality, MODALITY_LABELS, metrics.totalMentorships);
}
