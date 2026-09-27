const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionCenter',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    examName: {
      type: String,
      required: [true, 'Exam/Assessment name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    examDate: {
      type: Date,
      default: Date.now,
    },
    sentToParent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Performance', performanceSchema);
