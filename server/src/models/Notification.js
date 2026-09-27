const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'TUTOR_APPROVED',
        'TUTOR_REJECTED',
        'CENTER_APPROVED',
        'CENTER_REJECTED',
        'REQUIREMENT_PUBLISHED',
        'TUTOR_APPLICATION',
        'DEMO_SCHEDULED',
        'DEMO_COMPLETED',
        'PARENT_DECISION',
        'TUTOR_ASSIGNED',
        'PAYMENT_SUBMITTED',
        'PAYMENT_APPROVED',
        'PAYMENT_REJECTED',
        'SUBSCRIPTION_ACTIVATED',
        'SUBSCRIPTION_EXPIRED',
        'ATTENDANCE_MARKED',
        'REPORT_SUBMITTED',
        'CHAT_MESSAGE',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    link: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
