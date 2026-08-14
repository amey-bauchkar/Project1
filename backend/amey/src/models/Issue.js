import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
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

export const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
