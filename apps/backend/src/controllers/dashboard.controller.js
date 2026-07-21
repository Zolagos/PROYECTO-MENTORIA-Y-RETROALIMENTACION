import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user);
  return ApiResponse.success(res, summary);
});

export const getMetrics = asyncHandler(async (req, res) => {
  const metrics = await dashboardService.getMetrics(req.user);
  return ApiResponse.success(res, metrics);
});
