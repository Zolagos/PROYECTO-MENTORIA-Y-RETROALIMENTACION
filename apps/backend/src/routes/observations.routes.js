import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import { listObservations } from '../controllers/observations.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/observations', listObservations);

export default router;
