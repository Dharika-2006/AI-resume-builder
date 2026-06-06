import express from 'express';
import auth from '../middleware/auth.js';
import {
  handleGenerateSummary,
  handleImproveExperience,
  handleAtsInsights,
  handleImproveProject,
  handleSuggestSkills,
  handleTailorResume,
} from '../controllers/aiController.js';

const router = express.Router();

// Apply auth middleware to protect all routes in this group
router.use(auth);

// AI action routes
router.post('/generate-summary', handleGenerateSummary);
router.post('/improve-experience', handleImproveExperience);
router.post('/ats-insights', handleAtsInsights);
router.post('/improve-project', handleImproveProject);
router.post('/suggest-skills', handleSuggestSkills);
router.post('/tailor-resume', handleTailorResume);

export default router;
