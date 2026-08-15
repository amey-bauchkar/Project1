import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // Stored as [longitude, latitude] per GeoJSON format
        required: [true, 'Location coordinates [lng, lat] are required'],
      },
    },
    category: {
      type: String,
      enum: ['Roads', 'Water', 'Sanitation', 'Electricity', 'Other'],
      required: [true, 'Category is required'],
    },
    severity: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: [true, 'Severity is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },

    // ─── AI Triage Fields ──────────────────────────────────────────
    aiSummary: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      enum: ['Roads & Infrastructure', 'Water Supply', 'Sanitation & Waste', 'Electricity Board', 'General Services'],
      default: 'General Services',
    },
    aiConfidence: {
      type: Number,
      default: 0,
    },

    // ─── Worker Assignment Fields ──────────────────────────────────
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionImageUrl: {
      type: String,
      default: '',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },

    // ─── Community Engagement ──────────────────────────────────────
    upvotes: {
      type: Number,
      default: 1,
    },
    upvotedBy: [
      {
        type: String, // Anonymous voter ID, device UUID, or IP
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index on location for spatial queries (finding nearby issues)
IssueSchema.index({ location: '2dsphere' });

// Compound index for duplicate detection queries
IssueSchema.index({ category: 1, status: 1 });

export const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
