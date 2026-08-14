import { Issue } from '../models/Issue.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { triageIssueWithVision } from '../services/groqService.js';

/**
 * @desc    Submit a new civic issue (Citizen)
 * @route   POST /api/issues
 * @access  Public (Multipart/form-data: image, description, latitude, longitude)
 */
export const createIssue = async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;
    const file = req.file;

    // Validate required fields
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required.',
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

    // Step 1: Upload image to Cloudinary (or fallback Data URI)
    const imageUrl = await uploadToCloudinary(file.buffer, file.originalname);

    // Step 2: Groq Vision AI Triage for Category & Severity
    const { category, severity } = await triageIssueWithVision(imageUrl, description);

    // Step 3: Create GeoJSON Issue record in MongoDB
    // Note: GeoJSON stores coordinates as [longitude, latitude]
    const newIssue = await Issue.create({
      description: description.trim(),
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      category,
      severity,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newIssue._id,
        category: newIssue.category,
        severity: newIssue.severity,
        status: newIssue.status,
        description: newIssue.description,
        imageUrl: newIssue.imageUrl,
        location: newIssue.location,
        createdAt: newIssue.createdAt,
      },
    });
  } catch (error) {
    console.error('[Create Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create and triage issue.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all issues with optional filtering (Admin Dashboard & Map)
 * @route   GET /api/issues
 * @access  Public
 */
export const getIssues = async (req, res) => {
  try {
    const { status, category, severity, limit = 100 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error('[Get Issues Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update issue resolution status
 * @route   PATCH /api/issues/:id/status
 * @access  Protected (Requires Bearer JWT)
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
    await issue.save();

    res.status(200).json({
      success: true,
      message: `Issue status updated to ${status}.`,
      data: issue,
    });
  } catch (error) {
    console.error('[Update Issue Status Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue status.',
      error: error.message,
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
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error('[Get Issue By ID Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue details.',
      error: error.message,
    });
  }
};
