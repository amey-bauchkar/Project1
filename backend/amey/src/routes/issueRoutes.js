import { Router } from 'express';
import {
  createIssue,
  getIssues,
  updateIssueStatus,
  getIssueById,
  getNearbyIssues,
  upvoteIssue,
} from '../controllers/issueController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/issues -> Multipart upload & AI triage (Citizen)
router.post('/', upload.single('image'), createIssue);

// GET /api/issues -> Fetch issues with optional filtering (Admin & Map)
router.get('/', getIssues);

// GET /api/issues/nearby -> Fetch issues near GPS coords within radius (Near-Me & Deduplication)
router.get('/nearby', getNearbyIssues);

// GET /api/issues/:id -> Get issue details
router.get('/:id', getIssueById);

// PATCH /api/issues/:id/upvote -> Upvote issue to boost urgency score
router.patch('/:id/upvote', upvoteIssue);

// PATCH /api/issues/:id/status -> Update status (Protected - Admin/Authorized)
router.patch('/:id/status', requireAuth, updateIssueStatus);

export default router;

