import { Router } from 'express';
import authMiddleware from '../modules/auth/middleware/auth.middleware.js';
import {
  getSessionFeedback,
  createSessionFeedback,
} from '../controllers/session.feedback.controller.js';

const router = Router();

router.get('/sessions/:sessionId/feedback', authMiddleware, getSessionFeedback);
router.post('/sessions/:sessionId/feedback', authMiddleware, createSessionFeedback);

export default router;
