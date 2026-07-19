import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import {
  getSessionFeedback,
  createSessionFeedback,
} from '../controllers/session.feedback.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/sessions/:sessionId/feedback', getSessionFeedback);
router.post('/sessions/:sessionId/feedback', createSessionFeedback);

export default router;
