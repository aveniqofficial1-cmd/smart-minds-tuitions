const mongoose = require('mongoose');

const tuitionRequirementSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedRole: {
      type: String,
      enum: ['parent', 'center', 'admin'],
      required: true,
      default: 'parent',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
    },
    school: {
      type: String,
      trim: true,
      default: '',
    },
    syllabus: {
      type: String,
      enum: ['CBSE', 'SSC', 'ICSE', 'State', 'Other'],
      required: true,
      default: 'CBSE',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salaryRange: {
      type: String,
      required: [true, 'Salary / Budget range is required'],
      trim: true,
    },
    teachingMode: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'offline',
      required: true,
    },
    eligibilityRules: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'PUBLISHED',
        'TUTOR_APPLICATIONS',
        'DEMO_SCHEDULED',
        'DEMO_COMPLETED',
        'PARENT_DECISION',
        'ASSIGNED',
        'CLOSED',
      ],
      default: 'SUBMITTED',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
    },
    assignedTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TuitionRequirement', tuitionRequirementSchema);
