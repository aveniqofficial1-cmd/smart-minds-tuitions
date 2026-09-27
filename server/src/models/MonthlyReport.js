const mongoose = require('mongoose');

const monthlyReportSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    studentName: {
      type: String,
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
    month: {
      type: String,
      required: [true, 'Month is required (e.g., September)'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required (e.g., 2026)'],
    },
    attendanceCount: {
      type: Number,
      default: 0,
    },
    totalClasses: {
      type: Number,
      default: 0,
    },
    syllabusCovered: {
      type: String,
      required: [true, 'Syllabus covered description is required'],
    },
    marks: {
      type: String,
      required: [true, 'Test/Assessment marks are required'],
    },
    remarks: {
      type: String,
      required: [true, 'General tutor remarks are required'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MonthlyReport', monthlyReportSchema);
