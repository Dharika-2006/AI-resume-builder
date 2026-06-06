import express from 'express';
import auth from '../middleware/auth.js';
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import {
  handleCreateSnapshot,
  handleGetHistory,
  handleGetVersionDetails,
  handleRestoreVersion,
  handleCompareVersions,
} from '../controllers/versionController.js';

const router = express.Router();

// ── Protect All Resume Routes ──
router.use(auth);

// ── CRUD Router Mapping ──
router.post('/', createResume);
router.get('/', getMyResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

// ── Versioning Endpoints ──
router.post('/:id/versions', handleCreateSnapshot);
router.get('/:id/versions', handleGetHistory);
router.get('/:id/versions/:versionId', handleGetVersionDetails);
router.post('/:id/versions/:versionId/restore', handleRestoreVersion);
router.get('/:id/compare', handleCompareVersions);

export default router;
