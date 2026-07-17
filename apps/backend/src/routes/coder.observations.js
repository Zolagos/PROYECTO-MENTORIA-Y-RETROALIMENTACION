import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  listObservations,
  getObservation,
  createObservation,
  updateObservation,
  deleteObservation,
} from '../controllers/coder.observation.controller.js';

const router = Router();

router.get('/coder-observations', authMiddleware, listObservations);
router.get('/coder-observations/:id', authMiddleware, getObservation);
router.post('/coder-observations', authMiddleware, createObservation);
router.put('/coder-observations/:id', authMiddleware, updateObservation);
router.delete('/coder-observations/:id', authMiddleware, deleteObservation);

export default router;
