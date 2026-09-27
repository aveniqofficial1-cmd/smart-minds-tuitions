const mongoose = require('mongoose');

const parentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      area: String,
      city: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ParentProfile', parentProfileSchema);
