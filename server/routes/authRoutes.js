import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

// ── Public Routes ──────────────────────────────────────────
// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// ── Protected Routes ───────────────────────────────────────
// GET /api/auth/profile   (requires valid JWT)
router.get('/profile', auth, getProfile);

export default router;
