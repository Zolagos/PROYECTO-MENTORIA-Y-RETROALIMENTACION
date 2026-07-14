import { Router } from 'express';
import { createMentoringRequest } from '../controllers/mentoring.request.controller.js';

const router = Router();

router.post('/mentoring-requests', createMentoringRequest);

export default router;
