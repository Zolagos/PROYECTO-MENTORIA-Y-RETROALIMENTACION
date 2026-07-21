import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/roles.js';
import * as dashboardModel from '../models/dashboard.model.js';

const round1 = (n) => Math.round(n * 10) / 10;

export const getSummary = async (actor) => {
  const actorId = Number(actor?.dbId);
  const clanId = Number(actor?.clanId);

  if (!Number.isInteger(actorId) || actorId <= 0) {
    throw new ApiError('Invalid authenticated user', 401);
  }

  if (actor.role === ROLES.CODER) {
    const row = await dashboardModel.getCoderSummary(actorId);
    return {
      sessionsThisMonth: Number(row.sessions_this_month),
      completed: Number(row.completed),
      pending: Number(row.pending),
    };
  }

  if (actor.role === ROLES.TUTOR) {
    const row = await dashboardModel.getTutorSummary(actorId);
    return {
      assignedCoders: Number(row.assigned_coders),
      activeMentorships: Number(row.active_mentorships),
      pendingFeedbacks: Number(row.pending_feedbacks),
    };
  }

  if (actor.role === ROLES.TEAM_LEADER) {
    if (!Number.isInteger(clanId) || clanId <= 0) {
      throw new ApiError('The authenticated user is not assigned to a clan', 409);
    }

    const row = await dashboardModel.getTeamLeaderSummary(clanId);
    const totalSessions = Number(row.total_sessions);
    const completed = Number(row.completed_mentorships);

    return {
      totalUsers: Number(row.total_users),
      completedMentorships: completed,
      pendingMentorships: Number(row.pending_mentorships),
      completionRate: totalSessions > 0 ? round1((completed / totalSessions) * 100) : 0,
    };
  }

  throw new ApiError('You do not have permission to view the dashboard', 403);
};

export const getMetrics = async (actor) => {
  if (actor.role !== ROLES.TEAM_LEADER) {
    throw new ApiError('Only Team Leaders can view metrics', 403);
  }

  const clanId = Number(actor?.clanId);
  if (!Number.isInteger(clanId) || clanId <= 0) {
    throw new ApiError('The authenticated user is not assigned to a clan', 409);
  }

  const metrics = await dashboardModel.getMetrics(clanId);

  return {
    totalMentorships: metrics.totalMentorships,
    completionRate: metrics.totalMentorships > 0
      ? round1((metrics.completedMentorships / metrics.totalMentorships) * 100)
      : 0,
    averageRating: round1(metrics.averageRating),
    activeCoders: metrics.activeCoders,
    byStatus: metrics.byStatus,
    byModality: metrics.byModality,
  };
};
