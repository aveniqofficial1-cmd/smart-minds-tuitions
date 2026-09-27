const path = require('path');
const fs = require('fs');
const { uploadsDir } = require('../config/upload');
const TutorProfile = require('../models/TutorProfile');
const TuitionCenter = require('../models/TuitionCenter');
const Subscription = require('../models/Subscription');
const CommissionPayment = require('../models/CommissionPayment');

// @desc    Secure Document Download / View (KYC, PAN, Aadhar, Payment proof)
// @route   GET /api/documents/:filename
// @access  Private (Owner of doc or Admin)
const getDocument = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const user = req.user;

    // Prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadsDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Document file not found' });
    }

    // If Admin, full access granted
    if (user.role === 'admin') {
      return res.sendFile(filePath);
    }

    // If Tutor, check if file belongs to this tutor's profile, subscriptions or commissions
    if (user.role === 'tutor') {
      const profile = await TutorProfile.findOne({ user: user._id });
      const isProfileDoc =
        profile?.documents?.aadhar === safeFilename ||
        profile?.documents?.photo === safeFilename ||
        profile?.documents?.pan === safeFilename ||
        profile?.documents?.memos?.includes(safeFilename);

      if (isProfileDoc) {
        return res.sendFile(filePath);
      }

      const hasSubscriptionProof = await Subscription.findOne({
        tutor: user._id,
        paymentScreenshot: safeFilename,
      });
      if (hasSubscriptionProof) {
        return res.sendFile(filePath);
      }

      const hasCommissionProof = await CommissionPayment.findOne({
        tutor: user._id,
        paymentScreenshot: safeFilename,
      });
      if (hasCommissionProof) {
        return res.sendFile(filePath);
      }
    }

    // If Center, check if file belongs to center documents
    if (user.role === 'center') {
      const center = await TuitionCenter.findOne({ user: user._id });
      if (center?.documents?.includes(safeFilename)) {
        return res.sendFile(filePath);
      }
    }

    // Unauthorized access
    return res.status(403).json({
      success: false,
      message: 'Access denied: You are not authorized to view this document.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDocument };
