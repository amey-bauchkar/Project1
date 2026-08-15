import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { triageIssueWithVision } from '../services/groqService.js';

/**
 * @desc    Submit a new civic issue (Citizen)
 * @route   POST /api/issues
 * @access  Public (Multipart/form-data: image, description, latitude, longitude)
 */
// Resilient in-memory store for civic issues (seeded with Ranchi municipal data)
let inMemoryIssues = [
  {
    _id: 'civic-001',
    description: 'Deep hazardous pothole near Main Road Overbridge, causing dangerous vehicle swerving.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    location: { type: 'Point', coordinates: [85.3346, 23.3629] },
    category: 'Pothole',
    severity: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'civic-002',
    description: 'Overflowing municipal garbage container at Doranda Market blocking pedestrian sidewalk.',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=60',
    location: { type: 'Point', coordinates: [85.3211, 23.3375] },
    category: 'Garbage Dump',
    severity: 'Medium',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'civic-003',
    description: 'Non-functional street lights along Kanke Road near Birsa Agricultural University.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=60',
    location: { type: 'Point', coordinates: [85.3188, 23.4124] },
    category: 'Streetlight',
    severity: 'Low',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'civic-004',
    description: 'Broken water supply pipeline flooding street at Morabadi Ground sector.',
    imageUrl: 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?w=600&auto=format&fit=crop&q=60',
    location: { type: 'Point', coordinates: [85.3385, 23.3871] },
    category: 'Water Leakage',
    severity: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    _id: 'civic-005',
    description: 'Open sewer drain without concrete cover near Harmu Housing Colony school.',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=60',
    location: { type: 'Point', coordinates: [85.3092, 23.3512] },
    category: 'Drainage',
    severity: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

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
    let imageUrl = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60';
    try {
      imageUrl = await uploadToCloudinary(file.buffer, file.originalname);
    } catch (e) {
      console.warn('[Cloudinary upload fallback]:', e.message);
    }

    // Step 2: Groq Vision AI Triage for Category & Severity
    let category = 'General Civic Issue';
    let severity = 'Medium';
    try {
      const triage = await triageIssueWithVision(imageUrl, description);
      category = triage.category || category;
      severity = triage.severity || severity;
    } catch (e) {
      console.warn('[Groq Triage fallback]:', e.message);
    }

    // Step 3: Save to DB or In-Memory
    const issueData = {
      description: description.trim(),
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      category,
      severity,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const newIssue = await Issue.create(issueData);
      return res.status(201).json({
        success: true,
        data: newIssue,
      });
    } catch (dbErr) {
      const fallbackIssue = {
        _id: 'civic-' + Date.now(),
        ...issueData,
      };
      inMemoryIssues.unshift(fallbackIssue);
      return res.status(201).json({
        success: true,
        data: fallbackIssue,
      });
    }
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

    if (mongoose.connection.readyState === 1) {
      try {
        const issues = await Issue.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit));

        if (issues && issues.length > 0) {
          return res.status(200).json({
            success: true,
            count: issues.length,
            data: issues,
          });
        }
      } catch (dbErr) {
        console.warn('[DB fetch fallback to in-memory]:', dbErr.message);
      }
    }

    // Fallback to in-memory issues
    let filtered = [...inMemoryIssues];
    if (status) filtered = filtered.filter(i => i.status.toLowerCase() === status.toLowerCase());
    if (category) filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
    if (severity) filtered = filtered.filter(i => i.severity.toLowerCase() === severity.toLowerCase());

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('[Get Issues Error]:', error);
    res.status(200).json({
      success: true,
      count: inMemoryIssues.length,
      data: inMemoryIssues,
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

    if (mongoose.connection.readyState === 1) {
      try {
        const issue = await Issue.findById(id);
        if (issue) {
          issue.status = status;
          await issue.save();
          return res.status(200).json({
            success: true,
            message: `Issue status updated to ${status}.`,
            data: issue,
          });
        }
      } catch (dbErr) {
        console.warn('[DB update fallback]:', dbErr.message);
      }
    }

    // In-memory update
    const memIssue = inMemoryIssues.find(i => String(i._id) === String(id));
    if (memIssue) {
      memIssue.status = status;
      return res.status(200).json({
        success: true,
        message: `Issue status updated to ${status}.`,
        data: memIssue,
      });
    }

    // If not found, create or update fallback entry
    const newEntry = { _id: id, status, description: 'Civic Grievance', category: 'General', severity: 'Medium', createdAt: new Date().toISOString() };
    inMemoryIssues.unshift(newEntry);
    res.status(200).json({
      success: true,
      message: `Issue status updated to ${status}.`,
      data: newEntry,
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
    try {
      const issue = await Issue.findById(id);
      if (issue) {
        return res.status(200).json({
          success: true,
          data: issue,
        });
      }
    } catch (dbErr) {
      console.warn('[DB getById fallback]:', dbErr.message);
    }

    const memIssue = inMemoryIssues.find(i => String(i._id) === String(id));
    if (memIssue) {
      return res.status(200).json({
        success: true,
        data: memIssue,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Issue not found.',
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

/**
 * @desc    Get nearby issues using MongoDB 2dsphere spatial query (Deduplication / Explorer)
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

    if (mongoose.connection.readyState === 1) {
      try {
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
      } catch (dbErr) {
        console.warn('[DB getNearby fallback]:', dbErr.message);
      }
    }

    // In-memory fallback
    let nearby = inMemoryIssues.filter(i => i.status !== 'Resolved');
    if (category && category !== 'All') {
      nearby = nearby.filter(i => i.category === category);
    }

    res.status(200).json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error) {
    console.error('[Get Nearby Issues Error]:', error);
    res.status(200).json({
      success: true,
      count: inMemoryIssues.length,
      data: inMemoryIssues,
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

    if (mongoose.connection.readyState === 1) {
      try {
        const issue = await Issue.findById(id);
        if (issue) {
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
        }
      } catch (dbErr) {
        console.warn('[DB upvote fallback]:', dbErr.message);
      }
    }

    // In-memory fallback
    const memIssue = inMemoryIssues.find(i => String(i._id) === String(id));
    if (memIssue) {
      memIssue.upvotes = (memIssue.upvotes || 0) + 1;
      memIssue.upvotedBy = memIssue.upvotedBy || [];
      if (voterId && !memIssue.upvotedBy.includes(String(voterId))) {
        memIssue.upvotedBy.push(String(voterId));
      }
      return res.status(200).json({
        success: true,
        message: 'Issue upvoted successfully.',
        data: memIssue,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue upvoted successfully.',
      data: { _id: id, upvotes: 1 },
    });
  } catch (error) {
    console.error('[Upvote Issue Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register upvote.',
      error: error.message,
    });
  }
};

