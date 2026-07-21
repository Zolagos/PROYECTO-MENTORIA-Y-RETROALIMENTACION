import * as mentoringRequestModel from '../models/mentoring.request.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ROLES } from '../config/roles.js';

export const listMentoringRequests = asyncHandler(async (req, res) => {
  let { coder_id } = req.query;
  let clan_id;

  if (req.user.role === ROLES.CODER) {
    coder_id = req.user.id;
  } else if (req.user.role === ROLES.TEAM_LEADER || req.user.role === ROLES.TUTOR) {
    coder_id = coder_id ? Number(coder_id) : undefined;
    clan_id = req.user.clanId;
  } else {
    throw new ApiError('Access denied', 403);
  }

  const requests = await mentoringRequestModel.findAll({ coder_id, clan_id });

  return ApiResponse.success(res, requests);
});

export const getMentoringRequest = asyncHandler(async (req, res) => {
  if (
    req.user.role !== ROLES.CODER &&
    req.user.role !== ROLES.TEAM_LEADER &&
    req.user.role !== ROLES.TUTOR
  ) {
    throw new ApiError('Access denied', 403);
  }

  const request = await mentoringRequestModel.findById(req.params.id);

  if (!request) {
    throw new ApiError('Mentoring request not found', 404);
  }

  if (req.user.role === ROLES.CODER && request.coder_id !== req.user.id) {
    throw new ApiError('Access denied', 403);
  }

  if (
    (req.user.role === ROLES.TEAM_LEADER || req.user.role === ROLES.TUTOR) &&
    Number(request.coder_clan_id) !== Number(req.user.clanId)
  ) {
    throw new ApiError('Access denied', 403);
  }

  return ApiResponse.success(res, request);
});

export const createMentoringRequest = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CODER) {
    throw new ApiError('Only coders can create mentoring requests', 403);
  }

  let { topic, description } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    throw new ApiError('topic is required and must be a non-empty string', 400);
  }

  if (topic.length > 200) {
    throw new ApiError('topic must not exceed 200 characters', 400);
  }

  if (description !== undefined && typeof description !== 'string') {
    throw new ApiError('description must be a string', 400);
  }

  if (description && description.length > 1000) {
    throw new ApiError('description must not exceed 1000 characters', 400);
  }

  let mentoringRequest;
  try {
    mentoringRequest = await mentoringRequestModel.createRequest({ coder_id: req.user.id, topic: topic.trim(), description: description?.trim() });
  } catch (error) {
    if (error.code === '23503') {
      throw new ApiError('coder_id does not reference an existing user', 400);
    }
    throw error;
  }

  return ApiResponse.created(res, mentoringRequest);
});

export const updateMentoringStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER && req.user.role !== ROLES.TUTOR)
    throw new ApiError('Access denied', 403);

  const mentoring_id = req.params.id;
  const { mentoring_status } = req.body;

  if (!mentoring_status || typeof mentoring_status !== 'string' || mentoring_status.trim().length === 0) {
    throw new ApiError('mentoring_status is required and must be a non-empty string', 400);
  }

  const existing = await mentoringRequestModel.findById(mentoring_id);
  if (!existing) {
    throw new ApiError('Mentoring request not found', 404);
  }

  if (Number(existing.coder_clan_id) !== Number(req.user.clanId)) {
    throw new ApiError('Access denied', 403);
  }

  const updatedRequest = await mentoringRequestModel.updateMentoringRequest({ mentoring_id,mentoring_status });
  return ApiResponse.success(res, updatedRequest);
});

export const deleteMentoring = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.TEAM_LEADER)
    throw new ApiError('Access denied', 403);

  const mentoring_id = req.params.id;

  const existing = await mentoringRequestModel.findById(mentoring_id);
  if (!existing) {
    throw new ApiError('Mentoring request not found', 404);
  }

  if (Number(existing.coder_clan_id) !== Number(req.user.clanId)) {
    throw new ApiError('Access denied', 403);
  }

  const deletedRequest = await mentoringRequestModel.deleteMentoring({ mentoring_id });
  return ApiResponse.success(res, deletedRequest);
});