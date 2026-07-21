import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import { getSummary, getMetrics } from '../controllers/dashboard.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/summary', getSummary);
router.get('/metrics', getMetrics);

export default router;
