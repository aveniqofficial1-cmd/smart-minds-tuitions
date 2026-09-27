const TutorProfile = require('../models/TutorProfile');
const TuitionCenter = require('../models/TuitionCenter');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource. Required: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

const requireAdmin = requireRole('admin');
const requireParent = requireRole('parent');
const requireTutor = requireRole('tutor');
const requireCenter = requireRole('center');

// Gatekeeper for Tutors: Certain actions (like applying for tuitions) require Admin approval
const requireApprovedTutor = async (req, res, next) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to tutors only.',
    });
  }

  const profile = await TutorProfile.findOne({ user: req.user._id });

  if (!profile || profile.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: `Your tutor registration is currently ${profile ? profile.status.toUpperCase() : 'PENDING'}. You cannot apply for tuition requirements until Admin reviews and approves your KYC documents and agreement.`,
    });
  }

  req.tutorProfile = profile;
  next();
};

// Gatekeeper for Tuition Centers: Requires Admin approval to operate
const requireApprovedCenter = async (req, res, next) => {
  if (req.user.role !== 'center') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to tuition centers only.',
    });
  }

  const center = await TuitionCenter.findOne({ user: req.user._id });

  if (!center || center.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: `Your Tuition Center registration is currently ${center ? center.status.toUpperCase() : 'PENDING'}. Full operational features unlock once Admin verifies your center documents.`,
    });
  }

  req.tuitionCenter = center;
  next();
};

module.exports = {
  requireRole,
  requireAdmin,
  requireParent,
  requireTutor,
  requireCenter,
  requireApprovedTutor,
  requireApprovedCenter,
};
