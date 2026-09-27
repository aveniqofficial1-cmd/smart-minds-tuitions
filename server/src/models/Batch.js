const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionCenter',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Batch name is required'],
      trim: true,
    },
    classNumber: {
      type: String,
      required: [true, 'Class (1-10) is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    tutorName: {
      type: String,
      required: [true, 'Instructor/Tutor name is required'],
      trim: true,
    },
    timing: {
      type: String,
      required: [true, 'Class timing/schedule is required'],
      trim: true,
    },
    maxStudents: {
      type: Number,
      default: 20,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Batch', batchSchema);
