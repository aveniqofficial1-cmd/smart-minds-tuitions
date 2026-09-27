const mongoose = require('mongoose');

const commissionPaymentSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    firstMonthSalary: {
      type: Number,
      required: [true, 'First month salary amount is required'],
    },
    commissionAmount: {
      type: Number,
      required: [true, 'Commission amount (50% of first month salary) is required'],
    },
    paymentScreenshot: {
      type: String,
      default: '',
    },
    transactionRef: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING_UPLOAD', 'PENDING_VERIFICATION', 'PAID', 'REJECTED'],
      default: 'PENDING_UPLOAD',
    },
    submittedAt: {
      type: Date,
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

module.exports = mongoose.model('CommissionPayment', commissionPaymentSchema);
