import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { listMentoringRequests, getMentoringRequest, createMentoringRequest } from '../controllers/mentoring.request.controller.js';

const router = Router();

router.get('/mentoring-requests', authMiddleware, listMentoringRequests);
router.get('/mentoring-requests/:id', authMiddleware, getMentoringRequest);
router.post('/mentoring-requests', authMiddleware, createMentoringRequest);

export default router;
