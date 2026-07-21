import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import { listMentoringRequests, getMentoringRequest, createMentoringRequest } from '../controllers/mentoring.request.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/mentoring-requests', listMentoringRequests);
router.get('/mentoring-requests/:id', getMentoringRequest);
router.post('/mentoring-requests', createMentoringRequest);

export default router;
