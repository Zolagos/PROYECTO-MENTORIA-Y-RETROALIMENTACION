import pool from '../config/database.js';
import * as mentoringRequestModel from '../models/mentoring.request.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const listMentoringRequests = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { rows: users } = await pool.query(
    `SELECT u.id, r.name as role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );

  if (users.length === 0) {
    throw new ApiError('User not found', 401);
  }

  const user = users[0];
  let { coder_id } = req.query;

  if (user.role === 'Coder') {
    coder_id = user.id;
  } else if (user.role === 'Team Leader') {
    coder_id = coder_id ? Number(coder_id) : undefined;
  } else {
    throw new ApiError('Access denied', 403);
  }

  const requests = await mentoringRequestModel.findAll({ coder_id });

  return ApiResponse.success(res, requests);
});

export const getMentoringRequest = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { rows: users } = await pool.query(
    `SELECT u.id, r.name as role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );

  if (users.length === 0) {
    throw new ApiError('User not found', 401);
  }

  const user = users[0];

  if (user.role !== 'Coder' && user.role !== 'Team Leader') {
    throw new ApiError('Access denied', 403);
  }

  const request = await mentoringRequestModel.findById(req.params.id);

  if (!request) {
    throw new ApiError('Mentoring request not found', 404);
  }

  if (user.role === 'Coder' && request.coder_id !== user.id) {
    throw new ApiError('Access denied', 403);
  }

  return ApiResponse.success(res, request);
});

export const createMentoringRequest = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { rows: users } = await pool.query(
    `SELECT u.id, r.name as role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );

  if (users.length === 0) {
    throw new ApiError('User not found', 401);
  }

  const user = users[0];

  if (user.role !== 'Coder') {
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
    mentoringRequest = await mentoringRequestModel.createRequest({ coder_id: user.id, topic: topic.trim(), description: description?.trim() });
  } catch (error) {
    if (error.code === '23503') {
      throw new ApiError('coder_id does not reference an existing user', 400);
    }
    throw error;
  }

  return ApiResponse.created(res, mentoringRequest);
});
