import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  listObservations,
  getObservation,
  createObservation,
  updateObservation,
  deleteObservation,
} from '../controllers/tutor.observation.controller.js';

const router = Router();

router.get('/tutor-observations', authMiddleware, listObservations);
router.get('/tutor-observations/:id', authMiddleware, getObservation);
router.post('/tutor-observations', authMiddleware, createObservation);
router.put('/tutor-observations/:id', authMiddleware, updateObservation);
router.delete('/tutor-observations/:id', authMiddleware, deleteObservation);

export default router;
