import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { triageIssueWithVision } from '../services/groqService.js';

/**
 * Generate a human-readable tracking ID: JH-YYYYMMDD-XXXXX
 */
const generateTrackingId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = String(Date.now()).slice(-5);
  return `JH-${date}-${random}`;
};

/**
 * @desc    Submit a new civic issue (Citizen)
 * @route   POST /api/issues
 * @access  Public (Multipart/form-data: image, description, latitude, longitude)
 */
export const createIssue = async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required as photo evidence.',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Issue description is required.',
      });
    }

    if (latitude === undefined || longitude === undefined || latitude === '' || longitude === '') {
      return res.status(400).json({
        success: false,
        message: 'GPS Coordinates (latitude and longitude) are required.',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude format.',
      });
    }

    // Step 1: Upload image to Cloudinary
    let imageUrl;
    try {
      imageUrl = await uploadToCloudinary(file.buffer, file.originalname);
    } catch (e) {
      console.error('[Cloudinary Upload Error]:', e.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image. Please try again.',
      });
    }

    // Step 2: AI Vision Triage for Category, Severity, Summary, Department
    let triage = { category: 'Other', severity: 'Medium', summary: '', department: 'General Services', confidence: 0 };
    try {
      triage = await triageIssueWithVision(imageUrl, description);
    } catch (e) {
      console.warn('[Groq Triage fallback]:', e.message);
    }

    // Step 3: Check for duplicate issues within 200m with same category (unless force submission)
    const isForced = req.body.force === 'true' || req.body.force === true;
    if (!isForced) {
      const duplicates = await Issue.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 200, // 200 meters
          },
        },
        category: triage.category,
        status: { $ne: 'Resolved' },
      }).limit(3);

      if (duplicates.length > 0) {
        return res.status(200).json({
          success: true,
          isDuplicate: true,
          message: 'Similar issues found nearby. Consider upvoting existing reports instead.',
          existingIssues: duplicates.map((d) => ({
            _id: d._id,
            trackingId: d.trackingId,
            description: d.description,
            upvotes: d.upvotes,
            status: d.status,
            category: d.category,
            severity: d.severity,
          })),
        });
      }
    }

    // Step 4: Generate tracking ID and save to database
    const trackingId = generateTrackingId();

    const newIssue = await Issue.create({
      trackingId,
      description: description.trim(),
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      category: triage.category,
      severity: triage.severity,
      aiSummary: triage.summary,
      department: triage.department,
      aiConfidence: triage.confidence,
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      data: newIssue,
    });
  } catch (error) {
    console.error('[Create Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create and triage issue.',
    });
  }
};

/**
 * @desc    Get all issues with optional filtering and pagination
 * @route   GET /api/issues?status=...&category=...&severity=...&page=1&limit=20
 * @access  Public
 */
export const getIssues = async (req, res) => {
  try {
    const { status, category, severity } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email department');

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Get Issues Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues.',
    });
  }
};

/**
 * @desc    Track complaint by tracking ID
 * @route   GET /api/issues/track/:trackingId
 * @access  Public
 */
export const trackIssue = async (req, res) => {
  try {
    const issue = await Issue.findOne({ trackingId: req.params.trackingId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found. Please verify your tracking ID.',
      });
    }

    res.json({
      success: true,
      data: {
        trackingId: issue.trackingId,
        description: issue.description,
        imageUrl: issue.imageUrl,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        department: issue.department,
        aiSummary: issue.aiSummary,
        upvotes: issue.upvotes,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        resolvedAt: issue.resolvedAt,
        resolutionNotes: issue.resolutionNotes,
        resolutionImageUrl: issue.resolutionImageUrl,
      },
    });
  } catch (error) {
    console.error('[Track Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track complaint.',
    });
  }
};

/**
 * @desc    Update issue resolution status
 * @route   PATCH /api/issues/:id/status
 * @access  Protected (Requires Bearer JWT — Admin)
 */
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Resolved'];

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    issue.status = status;
    if (status === 'Resolved') {
      issue.resolvedAt = new Date();
    }
    await issue.save();

    return res.status(200).json({
      success: true,
      message: `Issue status updated to ${status}.`,
      data: issue,
    });
  } catch (error) {
    console.error('[Update Issue Status Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue status.',
    });
  }
};

/**
 * @desc    Get single issue by ID
 * @route   GET /api/issues/:id
 * @access  Public
 */
export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate('assignedTo', 'name email department');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error('[Get Issue By ID Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue details.',
    });
  }
};

/**
 * @desc    Get nearby issues using MongoDB 2dsphere spatial query
 * @route   GET /api/issues/nearby?lat=...&lng=...&radius=...&category=...
 * @access  Public
 */
export const getNearbyIssues = async (req, res) => {
  try {
    const { lat, lng, radius = 2000, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lng) query parameters are required.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDist = parseInt(radius, 10) || 2000;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinate format.',
      });
    }

    const query = {
      status: { $ne: 'Resolved' },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDist,
        },
      },
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    const issues = await Issue.find(query).limit(30);

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error('[Get Nearby Issues Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby issues.',
    });
  }
};

/**
 * @desc    Upvote a civic issue to escalate priority
 * @route   PATCH /api/issues/:id/upvote
 * @access  Public
 */
export const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { voterId } = req.body;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    // Check for duplicate vote
    if (voterId && issue.upvotedBy && issue.upvotedBy.includes(String(voterId))) {
      return res.status(200).json({
        success: true,
        message: 'Issue has already been upvoted by this citizen/device.',
        data: issue,
      });
    }

    const updateOps = { $inc: { upvotes: 1 } };
    if (voterId) {
      updateOps.$addToSet = { upvotedBy: String(voterId) };
    }

    const updatedIssue = await Issue.findByIdAndUpdate(id, updateOps, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Issue upvoted successfully.',
      data: updatedIssue,
    });
  } catch (error) {
    console.error('[Upvote Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register upvote.',
    });
  }
};

/**
 * @desc    Assign issue to a worker (Admin only)
 * @route   PATCH /api/issues/:id/assign
 * @access  Protected (Admin)
 */
export const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'Worker ID is required.',
      });
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({
        success: false,
        message: 'Invalid worker ID or user is not a worker.',
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    issue.assignedTo = workerId;
    issue.assignedAt = new Date();
    issue.status = 'In Progress';
    await issue.save();

    const populatedIssue = await Issue.findById(id).populate('assignedTo', 'name email department');

    return res.status(200).json({
      success: true,
      message: `Issue assigned to ${worker.name || worker.email}.`,
      data: populatedIssue,
    });
  } catch (error) {
    console.error('[Assign Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign issue.',
    });
  }
};

/**
 * @desc    Get tasks assigned to a worker
 * @route   GET /api/issues/worker/tasks
 * @access  Protected (Worker)
 */
export const getWorkerTasks = async (req, res) => {
  try {
    const workerId = req.user._id;
    const { status } = req.query;

    const filter = { assignedTo: workerId };
    if (status) filter.status = status;

    const tasks = await Issue.find(filter).sort({ assignedAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('[Get Worker Tasks Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worker tasks.',
    });
  }
};

/**
 * @desc    Worker resolves an issue with proof photo
 * @route   PATCH /api/issues/:id/resolve
 * @access  Protected (Worker)
 */
export const resolveIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const file = req.file;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    // Verify the worker is assigned to this issue
    if (String(issue.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this issue.',
      });
    }

    // Upload resolution proof image if provided
    if (file) {
      try {
        const resolutionImageUrl = await uploadToCloudinary(file.buffer, file.originalname);
        issue.resolutionImageUrl = resolutionImageUrl;
      } catch (e) {
        console.warn('[Resolution image upload error]:', e.message);
      }
    }

    issue.status = 'Resolved';
    issue.resolvedAt = new Date();
    issue.resolutionNotes = notes || '';
    await issue.save();

    return res.status(200).json({
      success: true,
      message: 'Issue resolved successfully.',
      data: issue,
    });
  } catch (error) {
    console.error('[Resolve Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve issue.',
    });
  }
};

/**
 * @desc    Get analytics data for dashboard
 * @route   GET /api/issues/analytics
 * @access  Protected (Admin)
 */
export const getAnalytics = async (req, res) => {
  try {
    const [
      totalIssues,
      pendingCount,
      inProgressCount,
      resolvedCount,
      categoryBreakdown,
      severityBreakdown,
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Pending' }),
      Issue.countDocuments({ status: 'In Progress' }),
      Issue.countDocuments({ status: 'Resolved' }),
      Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Issue.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Calculate average resolution time
    const resolvedIssues = await Issue.find({
      status: 'Resolved',
      resolvedAt: { $exists: true },
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedIssues.length > 0) {
      const totalHours = resolvedIssues.reduce((sum, issue) => {
        const diff = (new Date(issue.resolvedAt) - new Date(issue.createdAt)) / (1000 * 60 * 60);
        return sum + diff;
      }, 0);
      avgResolutionHours = Math.round(totalHours / resolvedIssues.length);
    }

    return res.status(200).json({
      success: true,
      data: {
        totalIssues,
        statusBreakdown: {
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
        },
        resolutionRate: totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0,
        avgResolutionHours,
        categoryBreakdown: categoryBreakdown.map((c) => ({ category: c._id, count: c.count })),
        severityBreakdown: severityBreakdown.map((s) => ({ severity: s._id, count: s.count })),
      },
    });
  } catch (error) {
    console.error('[Analytics Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics.',
    });
  }
};

/**
 * @desc    Get all workers (for assignment dropdown)
 * @route   GET /api/users/workers
 * @access  Protected (Admin)
 */
export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email department');

    return res.status(200).json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (error) {
    console.error('[Get Workers Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workers.',
    });
  }
};
