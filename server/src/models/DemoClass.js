const mongoose = require('mongoose');

const demoClassSchema = new mongoose.Schema(
  {
    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionRequirement',
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionCenter',
    },
    studentName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Demo date is required'],
    },
    time: {
      type: String,
      required: [true, 'Demo time is required'],
    },
    location: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    parentDecision: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    parentDecisionDate: {
      type: Date,
    },
    parentNotes: {
      type: String,
      default: '',
    },
    // Admin relays parent's decision to the tutor (FR-P4.5, FR-T3.3)
    adminRelayedStatus: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    adminRelayedDate: {
      type: Date,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DemoClass', demoClassSchema);
