/**
 * Upload Routes
 * Maps document parsing endpoints. Protected by JWT Bearer token middleware.
 */

import express from 'express';
import auth from '../middleware/auth.js';
import { uploadResume } from '../controllers/uploadController.js';

const router = express.Router();

// Mount protected parsing route
router.post('/resume', auth, uploadResume);

export default router;
