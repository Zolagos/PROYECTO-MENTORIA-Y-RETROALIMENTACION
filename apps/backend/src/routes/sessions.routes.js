import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import requireRole from '../middleware/requireRole.middleware.js';
import { assignParticipants, listSessions } from '../controllers/sessions.controller.js';
import { ROLES } from '../config/roles.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/', listSessions);

router.post(
  '/:id/participants',
  requireRole(ROLES.TEAM_LEADER, ROLES.TUTOR),
  assignParticipants
);

export default router;
