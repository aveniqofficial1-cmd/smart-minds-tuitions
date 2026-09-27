const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planName: {
      type: String,
      enum: ['3 Months', '6 Months', '9 Months', '12 Months'],
      required: true,
    },
    durationMonths: {
      type: Number,
      enum: [3, 6, 9, 12],
      required: true,
    },
    amount: {
      type: Number,
      enum: [300, 600, 900, 1200],
      required: true,
    },
    paymentScreenshot: {
      type: String,
      required: [true, 'Payment screenshot is required as proof of payment'],
    },
    transactionRef: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'ACTIVE', 'REJECTED', 'EXPIRED'],
      default: 'PENDING',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
