import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import attachDbUser from '../middleware/attachDbUser.middleware.js';
import {
  listObservations,
  getObservation,
  createObservation,
  updateObservation,
  deleteObservation,
} from '../controllers/tutor.observation.controller.js';

const router = Router();

router.use(authMiddleware, attachDbUser);

router.get('/tutor-observations', listObservations);
router.get('/tutor-observations/:id', getObservation);
router.post('/tutor-observations', createObservation);
router.put('/tutor-observations/:id', updateObservation);
router.delete('/tutor-observations/:id', deleteObservation);

export default router;
