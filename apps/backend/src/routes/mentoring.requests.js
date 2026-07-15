import { Router } from 'express';
import authMiddleware from '../modules/auth/middleware/auth.middleware.js';
import { createMentoringRequest } from '../controllers/mentoring.request.controller.js';

const router = Router();

router.post('/mentoring-requests', authMiddleware, createMentoringRequest);

export default router;
