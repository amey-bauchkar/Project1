import { Router } from 'express';
import {
  createIssue,
  getIssues,
  updateIssueStatus,
  getIssueById,
} from '../controllers/issueController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/issues -> Multipart upload & AI triage (Citizen)
router.post('/', upload.single('image'), createIssue);

// GET /api/issues -> Fetch issues with optional filtering (Admin & Map)
router.get('/', getIssues);

// GET /api/issues/:id -> Get issue details
router.get('/:id', getIssueById);

// PATCH /api/issues/:id/status -> Update status (Protected - Admin/Authorized)
router.patch('/:id/status', requireAuth, updateIssueStatus);

export default router;
