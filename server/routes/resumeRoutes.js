import express from 'express';
import auth from '../middleware/auth.js';
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';

const router = express.Router();

// ── Protect All Resume Routes ──
router.use(auth);

// ── CRUD Router Mapping ──
router.post('/', createResume);
router.get('/', getMyResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
