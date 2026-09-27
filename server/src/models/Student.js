const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionCenter',
    },
    name: {
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
      default: 'CBSE',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: Date,
    },
    rollNo: {
      type: String,
      trim: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    parentContact: {
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
