const TutorProfile = require('../models/TutorProfile');
const TuitionRequirement = require('../models/TuitionRequirement');
const TutorApplication = require('../models/TutorApplication');
const DemoClass = require('../models/DemoClass');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const MonthlyReport = require('../models/MonthlyReport');
const Subscription = require('../models/Subscription');
const CommissionPayment = require('../models/CommissionPayment');
const { sanitizeParentContact } = require('../middleware/contactPrivacy');
const { logAudit } = require('../middleware/audit');

// @desc    Get Tutor Dashboard Overview & Status
// @route   GET /api/tutors/dashboard
// @access  Private (Tutor)
const getTutorDashboard = async (req, res, next) => {
  try {
    const tutorId = req.user._id;

    const profile = await TutorProfile.findOne({ user: tutorId });

    const [
      activeTuitionsCount,
      appliedCount,
      demosCount,
      activeSubscription,
      pendingCommissionsCount,
    ] = await Promise.all([
      Assignment.countDocuments({ tutor: tutorId, status: 'ACTIVE' }),
      TutorApplication.countDocuments({ tutor: tutorId, status: 'APPLIED' }),
      DemoClass.countDocuments({ tutor: tutorId, status: 'SCHEDULED' }),
      Subscription.findOne({ tutor: tutorId, status: 'ACTIVE', endDate: { $gte: new Date() } }),
      CommissionPayment.countDocuments({ tutor: tutorId, status: { $in: ['PENDING_UPLOAD', 'PENDING_VERIFICATION'] } }),
    ]);

    // Active assignments with student info
    const activeAssignments = await Assignment.find({ tutor: tutorId, status: 'ACTIVE' })
      .populate('parent', 'name email phone')
      .populate('requirement', 'class subject location salaryRange');

    res.json({
      success: true,
      data: {
        profile,
        stats: {
          activeTuitionsCount,
          appliedCount,
          demosCount,
          hasActiveSubscription: !!activeSubscription,
          pendingCommissionsCount,
        },
        activeSubscription,
        activeAssignments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View Open Tuition Requirements (FR-T3.1, FR-T5 sanitized)
// @route   GET /api/tutors/requirements
// @access  Private (Tutor)
const getOpenRequirements = async (req, res, next) => {
  try {
    const { class: filterClass, subject, teachingMode, location } = req.query;

    const query = {
      status: { $in: ['PUBLISHED', 'TUTOR_APPLICATIONS'] },
    };

    if (filterClass) query.class = filterClass;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (teachingMode && teachingMode !== 'all') query.teachingMode = { $in: [teachingMode, 'both'] };
    if (location) query.location = { $regex: location, $options: 'i' };

    const requirements = await TuitionRequirement.find(query)
      .populate('postedBy', 'name')
      .sort({ publishedAt: -1, createdAt: -1 });

    // Sanitize contact info (FR-T5) - phone, email and address are hidden before assignment + accepted demo
    const sanitizedList = requirements.map((reqItem) => sanitizeParentContact(reqItem, false));

    // Also check if current tutor already applied to any of these
    const tutorApplications = await TutorApplication.find({
      tutor: req.user._id,
      requirement: { $in: requirements.map((r) => r._id) },
    });
    const appliedReqIds = new Set(tutorApplications.map((a) => a.requirement.toString()));

    const result = sanitizedList.map((item) => ({
      ...item,
      hasApplied: appliedReqIds.has(item._id.toString()),
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a Tuition Requirement (FR-T3.2, with 2+ subscription gate FR-T3.5)
// @route   POST /api/tutors/requirements/:id/apply
// @access  Private (Approved Tutor)
const applyForRequirement = async (req, res, next) => {
  try {
    const requirementId = req.params.id;
    const tutorId = req.user._id;

    // Verify tutor profile is approved
    const profile = await TutorProfile.findOne({ user: tutorId });
    if (!profile || profile.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your tutor profile must be approved by Admin before applying for tuition requirements.',
      });
    }

    const requirement = await TuitionRequirement.findById(requirementId);
    if (!requirement || !['PUBLISHED', 'TUTOR_APPLICATIONS'].includes(requirement.status)) {
      return res.status(400).json({
        success: false,
        message: 'This tuition requirement is currently not accepting applications.',
      });
    }

    // Check duplicate application
    const existingApp = await TutorApplication.findOne({ tutor: tutorId, requirement: requirementId });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this tuition requirement.',
      });
    }

    // Subscription Gate Rule (FR-T3.5):
    // If tutor already has 1 active tuition assignment, applying for a 2nd+ concurrent tuition requires an active subscription
    const activeAssignmentsCount = await Assignment.countDocuments({ tutor: tutorId, status: 'ACTIVE' });
    if (activeAssignmentsCount >= 1) {
      const activeSubscription = await Subscription.findOne({
        tutor: tutorId,
        status: 'ACTIVE',
        endDate: { $gte: new Date() },
      });

      if (!activeSubscription) {
        return res.status(403).json({
          success: false,
          requiresSubscription: true,
          message:
            'You currently have an active tuition. Taking on 2 or more concurrent tuitions requires an active subscription. Please subscribe to a plan to apply for additional tuitions.',
        });
      }
    }

    // Create application
    const application = await TutorApplication.create({
      tutor: tutorId,
      requirement: requirementId,
      proposalMessage: req.body.proposalMessage || '',
      status: 'APPLIED',
    });

    // Update requirement status if first application
    if (requirement.status === 'PUBLISHED') {
      requirement.status = 'TUTOR_APPLICATIONS';
      await requirement.save();
    }

    await logAudit({
      user: tutorId,
      userRole: 'tutor',
      action: 'TUTOR_APPLIED_REQUIREMENT',
      targetType: 'TuitionRequirement',
      targetId: requirementId,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Admin will review your profile for this tuition.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Applications
// @route   GET /api/tutors/applications
// @access  Private (Tutor)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await TutorApplication.find({ tutor: req.user._id })
      .populate('requirement', 'class studentName subject location salaryRange status teachingMode syllabus')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Demos (FR-T3.3)
// @route   GET /api/tutors/demos
// @access  Private (Tutor)
const getMyDemos = async (req, res, next) => {
  try {
    const demos = await DemoClass.find({ tutor: req.user._id })
      .populate('requirement', 'class studentName subject location teachingMode syllabus')
      .sort({ date: -1 });

    // Note: Tutor views relayed outcome by Admin (FR-T3.3)
    const formatted = demos.map((d) => ({
      _id: d._id,
      requirement: d.requirement,
      studentName: d.studentName,
      date: d.date,
      time: d.time,
      location: d.location,
      mode: d.mode,
      status: d.status,
      relayedOutcome: d.adminRelayedStatus,
      adminNotes: d.adminNotes,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Assigned Tuitions (FR-T4 - Contact details revealed)
// @route   GET /api/tutors/tuitions
// @access  Private (Tutor)
const getAssignedTuitions = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ tutor: req.user._id })
      .populate('parent', 'name email phone')
      .populate('requirement', 'class studentName subject location salaryRange teachingMode')
      .sort({ assignedDate: -1 });

    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Attendance for Assigned Tuition (FR-T4.5)
// @route   POST /api/tutors/attendance
// @access  Private (Tutor)
const markAttendance = async (req, res, next) => {
  try {
    const { assignmentId, studentName, date, status, topicCovered, remarks } = req.body;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      tutor: req.user._id,
      status: 'ACTIVE',
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Active assignment not found for marking attendance',
      });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.create({
      assignment: assignment._id,
      student: assignment.student,
      studentName: studentName || assignment.studentName,
      markedBy: req.user._id,
      date: attendanceDate,
      status: status || 'PRESENT',
      topicCovered: topicCovered || '',
      remarks: remarks || '',
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully!',
      data: attendanceRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Attendance Records for Tutor
// @route   GET /api/tutors/attendance
// @access  Private (Tutor)
const getTutorAttendance = async (req, res, next) => {
  try {
    const { assignmentId } = req.query;
    const query = { markedBy: req.user._id };

    if (assignmentId) {
      query.assignment = assignmentId;
    }

    const records = await Attendance.find(query)
      .populate('assignment', 'studentName class subject')
      .sort({ date: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Monthly Report (FR-T4.4)
// @route   POST /api/tutors/reports
// @access  Private (Tutor)
const submitMonthlyReport = async (req, res, next) => {
  try {
    const { assignmentId, month, year, syllabusCovered, marks, remarks, attendanceCount, totalClasses } = req.body;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      tutor: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const report = await MonthlyReport.create({
      assignment: assignment._id,
      student: assignment.student,
      studentName: assignment.studentName,
      tutor: req.user._id,
      parent: assignment.parent,
      month,
      year: Number(year) || new Date().getFullYear(),
      attendanceCount: Number(attendanceCount) || 0,
      totalClasses: Number(totalClasses) || 0,
      syllabusCovered,
      marks,
      remarks,
    });

    await logAudit({
      user: req.user._id,
      userRole: 'tutor',
      action: 'MONTHLY_REPORT_SUBMITTED',
      targetType: 'MonthlyReport',
      targetId: report._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Monthly student progress report submitted successfully!',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Submitted Monthly Reports
// @route   GET /api/tutors/reports
// @access  Private (Tutor)
const getTutorReports = async (req, res, next) => {
  try {
    const reports = await MonthlyReport.find({ tutor: req.user._id })
      .populate('assignment', 'studentName class subject')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Log Self-Reported Monthly Earnings (FR-T4.3)
// @route   POST /api/tutors/earnings
// @access  Private (Tutor)
const logMonthlyEarning = async (req, res, next) => {
  try {
    const { month, year, amount, studentName, notes } = req.body;

    const profile = await TutorProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    }

    profile.selfReportedEarnings.push({
      month,
      year: Number(year) || new Date().getFullYear(),
      amount: Number(amount),
      studentName: studentName || '',
      notes: notes || '',
      loggedAt: new Date(),
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Earnings entry recorded successfully!',
      data: profile.selfReportedEarnings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Self-Reported Monthly Earnings
// @route   GET /api/tutors/earnings
// @access  Private (Tutor)
const getMonthlyEarnings = async (req, res, next) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user._id });
    res.json({
      success: true,
      data: profile?.selfReportedEarnings || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Select Subscription & Upload Payment Screenshot (FR-T3.5)
// @route   POST /api/tutors/subscriptions
// @access  Private (Tutor)
const createSubscription = async (req, res, next) => {
  try {
    const { planName, durationMonths, amount, transactionRef } = req.body;

    const screenshot = req.file?.filename || req.body.screenshotUrl;

    if (!screenshot) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot proof is required.',
      });
    }

    const subscription = await Subscription.create({
      tutor: req.user._id,
      planName,
      durationMonths: Number(durationMonths),
      amount: Number(amount),
      paymentScreenshot: screenshot,
      transactionRef: transactionRef || '',
      status: 'UNDER_REVIEW',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'tutor',
      action: 'SUBSCRIPTION_PAYMENT_SUBMITTED',
      targetType: 'Subscription',
      targetId: subscription._id,
      ipAddress: req.ip,
      metadata: { planName, amount },
    });

    res.status(201).json({
      success: true,
      message: 'Subscription payment proof submitted! Admin will verify and activate your subscription.',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Subscriptions
// @route   GET /api/tutors/subscriptions
// @access  Private (Tutor)
const getTutorSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ tutor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload First-Month Commission Proof (FR-T4.1)
// @route   POST /api/tutors/commissions/upload
// @access  Private (Tutor)
const uploadCommissionProof = async (req, res, next) => {
  try {
    const { assignmentId, firstMonthSalary, transactionRef } = req.body;

    const screenshot = req.file?.filename || req.body.screenshotUrl;

    if (!screenshot) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot proof is required.',
      });
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      tutor: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const salary = Number(firstMonthSalary) || assignment.monthlySalary || 6000;
    const commission = salary * 0.5; // 50% commission

    let commissionPayment = await CommissionPayment.findOne({
      tutor: req.user._id,
      assignment: assignment._id,
    });

    if (commissionPayment) {
      commissionPayment.firstMonthSalary = salary;
      commissionPayment.commissionAmount = commission;
      commissionPayment.paymentScreenshot = screenshot;
      commissionPayment.transactionRef = transactionRef || '';
      commissionPayment.status = 'PENDING_VERIFICATION';
      commissionPayment.submittedAt = new Date();
      await commissionPayment.save();
    } else {
      commissionPayment = await CommissionPayment.create({
        tutor: req.user._id,
        assignment: assignment._id,
        studentName: assignment.studentName,
        firstMonthSalary: salary,
        commissionAmount: commission,
        paymentScreenshot: screenshot,
        transactionRef: transactionRef || '',
        status: 'PENDING_VERIFICATION',
        submittedAt: new Date(),
      });
    }

    await logAudit({
      user: req.user._id,
      userRole: 'tutor',
      action: 'COMMISSION_PAYMENT_SUBMITTED',
      targetType: 'CommissionPayment',
      targetId: commissionPayment._id,
      ipAddress: req.ip,
      metadata: { firstMonthSalary: salary, commissionAmount: commission },
    });

    res.status(200).json({
      success: true,
      message: 'First-month 50% commission payment proof submitted successfully! Admin will verify.',
      data: commissionPayment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor's Commission Records (FR-T4.1)
// @route   GET /api/tutors/commissions
// @access  Private (Tutor)
const getTutorCommissions = async (req, res, next) => {
  try {
    const commissions = await CommissionPayment.find({ tutor: req.user._id })
      .populate('assignment', 'studentName class subject')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTutorDashboard,
  getOpenRequirements,
  applyForRequirement,
  getMyApplications,
  getMyDemos,
  getAssignedTuitions,
  markAttendance,
  getTutorAttendance,
  submitMonthlyReport,
  getTutorReports,
  logMonthlyEarning,
  getMonthlyEarnings,
  createSubscription,
  getTutorSubscriptions,
  uploadCommissionProof,
  getTutorCommissions,
};
