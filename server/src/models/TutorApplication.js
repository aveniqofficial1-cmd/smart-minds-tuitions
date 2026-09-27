const mongoose = require('mongoose');

const tutorApplicationSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionRequirement',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'APPLIED',
        'SHORTLISTED',
        'DEMO_SCHEDULED',
        'DEMO_COMPLETED',
        'ACCEPTED',
        'REJECTED',
        'WITHDRAWN',
      ],
      default: 'APPLIED',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    demoStatus: {
      type: String,
      enum: ['NOT_SCHEDULED', 'SCHEDULED', 'COMPLETED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'NOT_SCHEDULED',
    },
    proposalMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same requirement by the same tutor
tutorApplicationSchema.index({ tutor: 1, requirement: 1 }, { unique: true });

module.exports = mongoose.model('TutorApplication', tutorApplicationSchema);
