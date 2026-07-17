import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import requireRole from '../middleware/requireRole.middleware.js';
import { assignParticipants } from '../controllers/sessions.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.post(
  '/:id/participants',
  requireRole('Team Leader', 'Tutor'),
  assignParticipants
);

export default router;
