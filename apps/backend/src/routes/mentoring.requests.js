import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import { listMentoringRequests, getMentoringRequest, createMentoringRequest, updateMentoringStatus, deleteMentoring } from '../controllers/mentoring.request.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/mentoring-requests', listMentoringRequests);
router.get('/mentoring-requests/:id', getMentoringRequest);
router.post('/mentoring-requests', createMentoringRequest);
router.put('/mentoring-requests/:id/status', updateMentoringStatus);
router.delete('/mentoring-requests/:id', deleteMentoring);

export default router;
