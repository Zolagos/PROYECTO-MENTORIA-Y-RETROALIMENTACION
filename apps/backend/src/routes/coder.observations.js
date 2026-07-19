import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import {
  listObservations,
  getObservation,
  createObservation,
  updateObservation,
  deleteObservation,
} from '../controllers/coder.observation.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/coder-observations', listObservations);
router.get('/coder-observations/:id', getObservation);
router.post('/coder-observations', createObservation);
router.put('/coder-observations/:id', updateObservation);
router.delete('/coder-observations/:id', deleteObservation);

export default router;
