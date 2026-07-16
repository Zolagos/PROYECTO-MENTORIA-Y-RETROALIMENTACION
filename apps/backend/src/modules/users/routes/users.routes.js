import { Router } from 'express';
import authMiddleware from '../../auth/middleware/auth.middleware.js';
import attachDbUser from '../../../middleware/attachDbUser.middleware.js';
import { listByRole } from '../controllers/users.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/', listByRole); 

export default router;