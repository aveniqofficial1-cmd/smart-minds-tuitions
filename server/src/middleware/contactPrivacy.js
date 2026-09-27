const Assignment = require('../models/Assignment');

/**
 * Sanitizes parent/student details when requested by a tutor or non-assigned user.
 * Redacts phone numbers, email addresses, exact house addresses unless an active assignment
 * with contactVisibilityGranted exists for that tutor and requirement.
 */
const sanitizeParentContact = (data, isAssignedTutor = false) => {
  if (!data) return data;

  const obj = typeof data.toObject === 'function' ? data.toObject() : { ...data };

  if (isAssignedTutor) {
    return obj; // Full details visible
  }

  // Redact private contact info
  if (obj.parentContact) {
    obj.parentContact = {
      phone: '***-***-**** (Visible after assignment)',
      email: '***@***.*** (Visible after assignment)',
    };
  }

  if (obj.postedBy && typeof obj.postedBy === 'object') {
    if (obj.postedBy.phone) obj.postedBy.phone = '***-***-**** (Protected)';
    if (obj.postedBy.email) obj.postedBy.email = '***@***.*** (Protected)';
  }

  if (obj.parent && typeof obj.parent === 'object') {
    if (obj.parent.phone) obj.parent.phone = '***-***-**** (Protected)';
    if (obj.parent.email) obj.parent.email = '***@***.*** (Protected)';
  }

  return obj;
};

/**
 * Sanitizes tutor details when requested by a parent before formal assignment & accepted demo.
 */
const sanitizeTutorContact = (data, isAssignedToParent = false) => {
  if (!data) return data;

  const obj = typeof data.toObject === 'function' ? data.toObject() : { ...data };

  if (isAssignedToParent) {
    return obj; // Full details visible
  }

  // Redact private contact info
  if (obj.whatsappNumber) {
    obj.whatsappNumber = '***-***-**** (Visible after demo acceptance & assignment)';
  }

  if (obj.user && typeof obj.user === 'object') {
    if (obj.user.phone) obj.user.phone = '***-***-**** (Protected)';
    if (obj.user.email) obj.user.email = '***@***.*** (Protected)';
  }

  if (obj.tutor && typeof obj.tutor === 'object') {
    if (obj.tutor.phone) obj.tutor.phone = '***-***-**** (Protected)';
    if (obj.tutor.email) obj.tutor.email = '***@***.*** (Protected)';
  }

  // Also redact sensitive KYC document paths for parents
  if (obj.documents) {
    delete obj.documents.aadhar;
    delete obj.documents.pan;
  }

  return obj;
};

/**
 * Checks if a specific tutor has been formally assigned to a requirement with accepted demo
 */
const checkAssignmentVisibility = async (tutorUserId, requirementId) => {
  if (!tutorUserId || !requirementId) return false;

  const assignment = await Assignment.findOne({
    tutor: tutorUserId,
    requirement: requirementId,
    status: 'ACTIVE',
    contactVisibilityGranted: true,
  });

  return !!assignment;
};

module.exports = {
  sanitizeParentContact,
  sanitizeTutorContact,
  checkAssignmentVisibility,
};
