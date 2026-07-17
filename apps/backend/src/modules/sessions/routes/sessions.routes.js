import { Router } from 'express';
import authenticate from '../../auth/middleware/auth.middleware.js';
import attachDbUser from 'src/middleware/attachDbUser.middleware.js';
import requireRole from 'src/middleware/requireRole.middleware.js';
import { assignParticipants } from 'src/modules/sessions/controllers/sessions.controller.js';

const router = Router();

router.use(authenticate, attachDbUser);

router.post(
  '/:id/participants',
  requireRole('Team Leader', 'Tutor'),
  assignParticipants
);

export default router;