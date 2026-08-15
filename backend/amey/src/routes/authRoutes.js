import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/register', requireAuth, requireAdmin, register);

export default router;
