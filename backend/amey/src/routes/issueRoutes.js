import { Router } from 'express';
import {
  createIssue,
  getIssues,
  updateIssueStatus,
  getIssueById,
  getNearbyIssues,
  upvoteIssue,
  trackIssue,
  assignIssue,
  getWorkerTasks,
  resolveIssue,
  getAnalytics,
  getWorkers,
} from '../controllers/issueController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth, requireAdmin, requireRole } from '../middleware/authMiddleware.js';
import { submitLimiter } from '../middleware/rateLimiter.js';
import { sanitizeInput } from '../middleware/sanitizeMiddleware.js';
import { detectSpam } from '../middleware/spamDetection.js';

const router = Router();

// ─── Static & Special Specific Routes (MUST be defined before /:id) ─
// GET /api/issues/analytics/dashboard -> Analytics data (Admin)
router.get('/analytics/dashboard', requireAuth, requireAdmin, getAnalytics);

// GET /api/issues/workers/list -> Get available workers (Admin)
router.get('/workers/list', requireAuth, requireAdmin, getWorkers);

// GET /api/issues/worker/tasks -> Worker's assigned tasks (Worker)
router.get('/worker/tasks', requireAuth, requireRole('worker'), getWorkerTasks);

// GET /api/issues/nearby -> Geospatial nearby issues query
router.get('/nearby', getNearbyIssues);

// GET /api/issues/track/:trackingId -> Citizen complaint tracking
router.get('/track/:trackingId', trackIssue);

// ─── General Issue Collection Routes ────────────────────────────────
// POST /api/issues -> Rate-limited, spam-checked, sanitized, AI-triaged submission
router.post('/', submitLimiter, upload.single('image'), detectSpam, sanitizeInput, createIssue);

// GET /api/issues -> Fetch issues with filtering & pagination
router.get('/', getIssues);

// ─── Dynamic ID-Based Routes (MUST be defined after static routes) ──
// GET /api/issues/:id -> Get issue details
router.get('/:id', getIssueById);

// PATCH /api/issues/:id/upvote -> Community upvote
router.patch('/:id/upvote', upvoteIssue);

// PATCH /api/issues/:id/status -> Update status (Admin)
router.patch('/:id/status', requireAuth, requireAdmin, updateIssueStatus);

// PATCH /api/issues/:id/assign -> Assign to worker (Admin)
router.patch('/:id/assign', requireAuth, requireAdmin, assignIssue);

// PATCH /api/issues/:id/resolve -> Worker submits resolution proof
router.patch('/:id/resolve', requireAuth, requireRole('worker'), upload.single('resolutionImage'), resolveIssue);

export default router;
