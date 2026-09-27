const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const TuitionCenter = require('../models/TuitionCenter');
const ParentProfile = require('../models/ParentProfile');
const TuitionRequirement = require('../models/TuitionRequirement');
const TutorApplication = require('../models/TutorApplication');
const DemoClass = require('../models/DemoClass');
const Assignment = require('../models/Assignment');
const Subscription = require('../models/Subscription');
const CommissionPayment = require('../models/CommissionPayment');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/audit');

// @desc    Get Admin Live Dashboard Metrics (FR-A6)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalTutors,
      pendingTutors,
      totalParents,
      totalCenters,
      pendingCenters,
      totalRequirements,
      openRequirements,
      activeAssignments,
      pendingSubscriptions,
      pendingCommissions,
      verifiedSubscriptions,
      verifiedCommissions,
    ] = await Promise.all([
      User.countDocuments({ role: 'tutor' }),
      TutorProfile.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'parent' }),
      User.countDocuments({ role: 'center' }),
      TuitionCenter.countDocuments({ status: 'pending' }),
      TuitionRequirement.countDocuments(),
      TuitionRequirement.countDocuments({ status: { $in: ['PUBLISHED', 'TUTOR_APPLICATIONS'] } }),
      Assignment.countDocuments({ status: 'ACTIVE' }),
      Subscription.countDocuments({ status: { $in: ['PENDING', 'UNDER_REVIEW'] } }),
      CommissionPayment.countDocuments({ status: 'PENDING_VERIFICATION' }),
      Subscription.find({ status: 'ACTIVE' }),
      CommissionPayment.find({ status: 'PAID' }),
    ]);

    // Calculate total verified earnings (FR-A6: Commission + Subscriptions only)
    const subscriptionEarnings = verifiedSubscriptions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const commissionEarnings = verifiedCommissions.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);
    const totalPlatformEarnings = subscriptionEarnings + commissionEarnings;

    // Recent activities / audit logs
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(8).populate('user', 'name role');

    res.json({
      success: true,
      data: {
        metrics: {
          totalTutors,
          pendingTutors,
          totalParents,
          totalCenters,
          pendingCenters,
          totalRequirements,
          openRequirements,
          activeAssignments,
          pendingSubscriptions,
          pendingCommissions,
          subscriptionEarnings,
          commissionEarnings,
          totalPlatformEarnings,
        },
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Tuition Requirements (FR-A2)
// @route   GET /api/admin/requirements
// @access  Private (Admin)
const getAllRequirements = async (req, res, next) => {
  try {
    const { status, class: reqClass, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') query.status = status;
    if (reqClass) query.class = reqClass;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const requirements = await TuitionRequirement.find(query)
      .populate('postedBy', 'name email phone role')
      .populate('assignedTutor', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requirements });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish / Update Requirement Status (FR-A2)
// @route   PUT /api/admin/requirements/:id/status
// @access  Private (Admin)
const updateRequirementStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, class: reqClass, subject, salaryRange, location, teachingMode, syllabus } = req.body;

    const requirement = await TuitionRequirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    if (status) requirement.status = status;
    if (adminNotes !== undefined) requirement.adminNotes = adminNotes;
    if (reqClass) requirement.class = reqClass;
    if (subject) requirement.subject = subject;
    if (salaryRange) requirement.salaryRange = salaryRange;
    if (location) requirement.location = location;
    if (teachingMode) requirement.teachingMode = teachingMode;
    if (syllabus) requirement.syllabus = syllabus;

    if (status === 'PUBLISHED' && !requirement.publishedAt) {
      requirement.publishedAt = new Date();
    }

    await requirement.save();

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `REQUIREMENT_STATUS_${status}`,
      targetType: 'TuitionRequirement',
      targetId: requirement._id,
      ipAddress: req.ip,
      metadata: { status, adminNotes },
    });

    res.json({
      success: true,
      message: `Requirement status updated to ${status}!`,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Tutors with KYC & Agreement details (FR-A3)
// @route   GET /api/admin/tutors
// @access  Private (Admin)
const getAllTutors = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;

    const tutors = await TutorProfile.find(query)
      .populate('user', 'name email phone avatar status createdAt lastLogin')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tutors });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Reject / Suspend Tutor (FR-A3)
// @route   PUT /api/admin/tutors/:id/status
// @access  Private (Admin)
const updateTutorStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // 'approved' | 'rejected' | 'suspended'

    const tutorProfile = await TutorProfile.findById(req.params.id).populate('user');
    if (!tutorProfile) {
      return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    }

    tutorProfile.status = status;
    if (status === 'approved') {
      tutorProfile.verifiedAt = new Date();
      tutorProfile.verifiedBy = req.user._id;
    }
    if (rejectionReason) {
      tutorProfile.rejectionReason = rejectionReason;
    }

    await tutorProfile.save();

    // Update user status
    await User.findByIdAndUpdate(tutorProfile.user._id, {
      status: status === 'approved' ? 'active' : status,
    });

    // Send Notification
    await Notification.create({
      recipient: tutorProfile.user._id,
      title: status === 'approved' ? 'Tutor Account Approved!' : 'Tutor Application Update',
      message:
        status === 'approved'
          ? 'Congratulations! Your documents and agreement have been verified. You can now apply for open tuition requirements.'
          : `Your tutor registration status was updated to ${status}. ${rejectionReason || ''}`,
      type: status === 'approved' ? 'TUTOR_APPROVED' : 'TUTOR_REJECTED',
      link: '/tutor/dashboard',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `TUTOR_${status.toUpperCase()}`,
      targetType: 'TutorProfile',
      targetId: tutorProfile._id,
      ipAddress: req.ip,
      metadata: { status, rejectionReason },
    });

    res.json({
      success: true,
      message: `Tutor status has been updated to ${status.toUpperCase()}!`,
      data: tutorProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Tuition Centers (FR-A3)
// @route   GET /api/admin/centers
// @access  Private (Admin)
const getAllCenters = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;

    const centers = await TuitionCenter.find(query)
      .populate('user', 'name email phone avatar status createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: centers });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Reject Tuition Center (FR-A3)
// @route   PUT /api/admin/centers/:id/status
// @access  Private (Admin)
const updateCenterStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    const center = await TuitionCenter.findById(req.params.id).populate('user');
    if (!center) {
      return res.status(404).json({ success: false, message: 'Tuition Center not found' });
    }

    center.status = status;
    if (status === 'approved') {
      center.verifiedAt = new Date();
      center.verifiedBy = req.user._id;
    }
    if (rejectionReason) center.rejectionReason = rejectionReason;
    await center.save();

    await User.findByIdAndUpdate(center.user._id, {
      status: status === 'approved' ? 'active' : status,
    });

    await Notification.create({
      recipient: center.user._id,
      title: status === 'approved' ? 'Tuition Center Approved!' : 'Tuition Center Application Update',
      message:
        status === 'approved'
          ? 'Your tuition center documents have been verified. You can now manage classes 1-10, batches, and operations.'
          : `Your center registration status was updated to ${status}.`,
      type: status === 'approved' ? 'CENTER_APPROVED' : 'CENTER_REJECTED',
      link: '/center/dashboard',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `CENTER_${status.toUpperCase()}`,
      targetType: 'TuitionCenter',
      targetId: center._id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Tuition Center status updated to ${status.toUpperCase()}!`,
      data: center,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Applications for a Requirement (FR-A2)
// @route   GET /api/admin/requirements/:id/applications
// @access  Private (Admin)
const getRequirementApplications = async (req, res, next) => {
  try {
    const applications = await TutorApplication.find({ requirement: req.params.id })
      .populate('tutor', 'name email phone avatar')
      .sort({ createdAt: -1 });

    const appsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await TutorProfile.findOne({ user: app.tutor._id });
        return {
          ...app.toObject(),
          tutorProfile: profile,
        };
      })
    );

    res.json({ success: true, data: appsWithProfiles });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule Demo for Requirement & Tutor (FR-P4.1)
// @route   POST /api/admin/demos/schedule
// @access  Private (Admin)
const scheduleDemo = async (req, res, next) => {
  try {
    const { requirementId, tutorId, date, time, location, mode, studentName } = req.body;

    const requirement = await TuitionRequirement.findById(requirementId);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    const demo = await DemoClass.create({
      requirement: requirement._id,
      tutor: tutorId,
      parent: requirement.postedBy,
      studentName: studentName || requirement.studentName,
      date: new Date(date),
      time,
      location: location || requirement.location,
      mode: mode || requirement.teachingMode || 'offline',
      status: 'SCHEDULED',
      parentDecision: 'PENDING',
      adminRelayedStatus: 'PENDING',
    });

    // Update requirement and application status
    requirement.status = 'DEMO_SCHEDULED';
    await requirement.save();

    await TutorApplication.findOneAndUpdate(
      { requirement: requirement._id, tutor: tutorId },
      { status: 'DEMO_SCHEDULED', demoStatus: 'SCHEDULED' }
    );

    // Notify Parent & Tutor
    await Notification.create({
      recipient: requirement.postedBy,
      title: 'Demo Class Scheduled',
      message: `A demo class with a verified tutor has been scheduled for ${studentName || requirement.studentName} on ${new Date(date).toLocaleDateString()} at ${time}.`,
      type: 'DEMO_SCHEDULED',
      link: '/parent/demos',
    });

    await Notification.create({
      recipient: tutorId,
      title: 'Demo Class Scheduled',
      message: `Admin has scheduled a demo session for you on ${new Date(date).toLocaleDateString()} at ${time}. Location: ${location || requirement.location}.`,
      type: 'DEMO_SCHEDULED',
      link: '/tutor/demos',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: 'DEMO_SCHEDULED_BY_ADMIN',
      targetType: 'DemoClass',
      targetId: demo._id,
      ipAddress: req.ip,
      metadata: { requirementId, tutorId, date, time },
    });

    res.status(201).json({
      success: true,
      message: 'Demo class scheduled successfully!',
      data: demo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convey / Relay Demo Outcome to Tutor (FR-P4.5, FR-T3.3)
// @route   PUT /api/admin/demos/:id/relay
// @access  Private (Admin)
const relayDemoOutcome = async (req, res, next) => {
  try {
    const { relayedStatus, adminNotes } = req.body; // 'ACCEPTED' | 'REJECTED'

    const demo = await DemoClass.findById(req.params.id);
    if (!demo) {
      return res.status(404).json({ success: false, message: 'Demo class not found' });
    }

    demo.adminRelayedStatus = relayedStatus;
    demo.adminRelayedDate = new Date();
    if (adminNotes) demo.adminNotes = adminNotes;
    await demo.save();

    await TutorApplication.findOneAndUpdate(
      { requirement: demo.requirement, tutor: demo.tutor },
      { demoStatus: relayedStatus, status: relayedStatus === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED' }
    );

    // Notify Tutor
    await Notification.create({
      recipient: demo.tutor,
      title: relayedStatus === 'ACCEPTED' ? 'Demo Class Accepted!' : 'Demo Outcome Update',
      message:
        relayedStatus === 'ACCEPTED'
          ? 'Great news! The demo class was accepted. Admin will formally assign the tuition to you.'
          : 'The demo was not selected for this requirement. You remain free to apply for other open requirements.',
      type: relayedStatus === 'ACCEPTED' ? 'PARENT_DECISION' : 'DEMO_COMPLETED',
      link: '/tutor/demos',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `DEMO_OUTCOME_RELAYED_${relayedStatus}`,
      targetType: 'DemoClass',
      targetId: demo._id,
      ipAddress: req.ip,
      metadata: { relayedStatus, adminNotes },
    });

    res.json({
      success: true,
      message: `Demo outcome relayed to tutor as ${relayedStatus}!`,
      data: demo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Formally Assign Tutor to Tuition Requirement (FR-P4.7, FR-P5.1, FR-T4.1)
// @route   POST /api/admin/assignments
// @access  Private (Admin)
const assignTutor = async (req, res, next) => {
  try {
    const { requirementId, tutorId, monthlySalary } = req.body;

    const requirement = await TuitionRequirement.findById(requirementId);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    // Check if assignment already exists
    let assignment = await Assignment.findOne({
      requirement: requirement._id,
      tutor: tutorId,
    });

    if (!assignment) {
      assignment = await Assignment.create({
        requirement: requirement._id,
        tutor: tutorId,
        parent: requirement.postedBy,
        student: requirement.student,
        studentName: requirement.studentName,
        class: requirement.class,
        subject: requirement.subject,
        monthlySalary: Number(monthlySalary) || 6000,
        contactVisibilityGranted: true, // Contact reveal enabled
      });
    }

    // Update requirement status
    requirement.status = 'ASSIGNED';
    requirement.assignedTutor = tutorId;
    requirement.assignedAt = new Date();
    await requirement.save();

    // Create Initial Commission Record (FR-T4.1: 50% first-month salary)
    const salary = Number(monthlySalary) || 6000;
    const commission = salary * 0.5;

    await CommissionPayment.findOneAndUpdate(
      { tutor: tutorId, assignment: assignment._id },
      {
        tutor: tutorId,
        assignment: assignment._id,
        studentName: assignment.studentName,
        firstMonthSalary: salary,
        commissionAmount: commission,
        status: 'PENDING_UPLOAD',
      },
      { upsert: true, new: true }
    );

    // Notify Parent & Tutor of formal assignment and contact revelation
    await Notification.create({
      recipient: requirement.postedBy,
      title: 'Tutor Formally Assigned!',
      message: 'Your tutor has been officially assigned. You can now view their full contact details, attendance, and reports.',
      type: 'TUTOR_ASSIGNED',
      link: '/parent/tutor',
    });

    await Notification.create({
      recipient: tutorId,
      title: 'Tuition Formally Assigned!',
      message: 'You have been officially assigned to the tuition. Contact details are revealed. Remember: pay your first month half salary to Admin — remaining months are yours.',
      type: 'TUTOR_ASSIGNED',
      link: '/tutor/tuitions',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: 'TUTOR_FORMALLY_ASSIGNED',
      targetType: 'Assignment',
      targetId: assignment._id,
      ipAddress: req.ip,
      metadata: { requirementId, tutorId, monthlySalary: salary },
    });

    res.status(201).json({
      success: true,
      message: 'Tutor officially assigned! Contact visibility is now unlocked for both parties.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Assignments (FR-A2)
// @route   GET /api/admin/assignments
// @access  Private (Admin)
const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate('tutor', 'name email phone avatar')
      .populate('parent', 'name email phone')
      .populate('requirement', 'class subject location salaryRange')
      .sort({ assignedDate: -1 });

    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Subscriptions & Verify (FR-A4.1)
// @route   GET /api/admin/subscriptions
// @access  Private (Admin)
const getAllSubscriptions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;

    const subscriptions = await Subscription.find(query)
      .populate('tutor', 'name email phone')
      .sort({ submittedAt: -1 });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Subscription Payment (FR-A4.1)
// @route   PUT /api/admin/subscriptions/:id/verify
// @access  Private (Admin)
const verifySubscription = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // 'ACTIVE' | 'REJECTED'

    const subscription = await Subscription.findById(req.params.id).populate('tutor');
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    subscription.status = status;
    subscription.verifiedAt = new Date();
    subscription.verifiedBy = req.user._id;

    if (status === 'ACTIVE') {
      subscription.startDate = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + (subscription.durationMonths || 3));
      subscription.endDate = end;
    } else if (rejectionReason) {
      subscription.rejectionReason = rejectionReason;
    }

    await subscription.save();

    await Notification.create({
      recipient: subscription.tutor._id,
      title: status === 'ACTIVE' ? 'Subscription Activated!' : 'Subscription Payment Rejected',
      message:
        status === 'ACTIVE'
          ? `Your ${subscription.planName} (Rs. ${subscription.amount}) subscription has been verified! You can now apply for 2+ concurrent tuitions.`
          : `Your subscription payment screenshot was rejected: ${rejectionReason || 'Please resubmit valid payment proof.'}`,
      type: status === 'ACTIVE' ? 'SUBSCRIPTION_ACTIVATED' : 'PAYMENT_REJECTED',
      link: '/tutor/subscription',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `SUBSCRIPTION_PAYMENT_${status}`,
      targetType: 'Subscription',
      targetId: subscription._id,
      ipAddress: req.ip,
      metadata: { status, planName: subscription.planName, amount: subscription.amount },
    });

    res.json({
      success: true,
      message: `Subscription payment marked as ${status}!`,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Commission Payments (FR-A4.2)
// @route   GET /api/admin/commissions
// @access  Private (Admin)
const getAllCommissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') query.status = status;

    const commissions = await CommissionPayment.find(query)
      .populate('tutor', 'name email phone')
      .populate('assignment', 'studentName class subject')
      .sort({ submittedAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify First-Month Commission Payment (FR-A4.2)
// @route   PUT /api/admin/commissions/:id/verify
// @access  Private (Admin)
const verifyCommission = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // 'PAID' | 'REJECTED'

    const commission = await CommissionPayment.findById(req.params.id).populate('tutor');
    if (!commission) {
      return res.status(404).json({ success: false, message: 'Commission record not found' });
    }

    commission.status = status;
    commission.verifiedAt = new Date();
    commission.verifiedBy = req.user._id;
    if (rejectionReason) commission.rejectionReason = rejectionReason;

    await commission.save();

    await Notification.create({
      recipient: commission.tutor._id,
      title: status === 'PAID' ? 'Commission Payment Verified!' : 'Commission Proof Rejected',
      message:
        status === 'PAID'
          ? `Your 50% commission payment of Rs. ${commission.commissionAmount} for student ${commission.studentName} has been verified and marked PAID! Remaining monthly fees are 100% yours.`
          : `Your commission payment screenshot was rejected: ${rejectionReason || 'Please resubmit valid proof.'}`,
      type: status === 'PAID' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
      link: '/tutor/commission',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'admin',
      action: `COMMISSION_PAYMENT_${status}`,
      targetType: 'CommissionPayment',
      targetId: commission._id,
      ipAddress: req.ip,
      metadata: { status, commissionAmount: commission.commissionAmount, studentName: commission.studentName },
    });

    res.json({
      success: true,
      message: `Commission payment verified and marked as ${status}!`,
      data: commission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Platform Monthly Earnings Breakdown (FR-A6)
// @route   GET /api/admin/earnings
// @access  Private (Admin)
const getMonthlyEarningsBreakdown = async (req, res, next) => {
  try {
    const verifiedCommissions = await CommissionPayment.find({ status: 'PAID' })
      .populate('tutor', 'name email')
      .sort({ verifiedAt: -1 });

    const verifiedSubscriptions = await Subscription.find({ status: 'ACTIVE' })
      .populate('tutor', 'name email')
      .sort({ verifiedAt: -1 });

    const totalCommission = verifiedCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const totalSubscription = verifiedSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalCommission,
          totalSubscription,
          totalEarnings: totalCommission + totalSubscription,
        },
        commissions: verifiedCommissions,
        subscriptions: verifiedSubscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Platform Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    const { action, limit = 50 } = req.query;
    const query = {};
    if (action) query.action = { $regex: action, $options: 'i' };

    const logs = await AuditLog.find(query)
      .populate('user', 'name role email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllRequirements,
  updateRequirementStatus,
  getAllTutors,
  updateTutorStatus,
  getAllCenters,
  updateCenterStatus,
  getRequirementApplications,
  scheduleDemo,
  relayDemoOutcome,
  assignTutor,
  getAllAssignments,
  getAllSubscriptions,
  verifySubscription,
  getAllCommissions,
  verifyCommission,
  getMonthlyEarningsBreakdown,
  getAuditLogs,
};
