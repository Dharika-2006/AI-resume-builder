import express from 'express';
import auth from '../middleware/auth.js';
import { analyzeATS, getATSHistory } from '../controllers/atsController.js';

const router = express.Router();

// Apply auth middleware to protect all routes in this group
router.use(auth);

// Route endpoints mapping
router.post('/analyze', analyzeATS);
router.get('/history', getATSHistory);

export default router;
