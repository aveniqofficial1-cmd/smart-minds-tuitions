const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Tutor must be at least 18 years old'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Teaching experience is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    maxClassCanTeach: {
      type: String,
      required: [true, 'Maximum class you can teach is required'],
    },
    teachingMode: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'both',
      required: true,
    },
    documents: {
      aadhar: { type: String, default: '' },
      photo: { type: String, default: '' },
      pan: { type: String, default: '' },
      memos: { type: [String], default: [] },
    },
    agreementAccepted: {
      type: Boolean,
      required: [true, 'You must accept the Tutor Agreement'],
      default: false,
    },
    agreementAcceptedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Self-reported monthly earnings log for the tutor's reference (FR-T4.3)
    selfReportedEarnings: [
      {
        month: String,
        year: Number,
        amount: Number,
        studentName: String,
        notes: String,
        loggedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
