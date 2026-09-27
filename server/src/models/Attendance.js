const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionCenter',
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    studentName: {
      type: String,
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT'],
      required: true,
      default: 'PRESENT',
    },
    topicCovered: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for easy query by date and assignment / batch
attendanceSchema.index({ assignment: 1, date: 1 });
attendanceSchema.index({ batch: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
