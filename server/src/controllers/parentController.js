const Student = require('../models/Student');
const TuitionRequirement = require('../models/TuitionRequirement');
const TutorApplication = require('../models/TutorApplication');
const DemoClass = require('../models/DemoClass');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const MonthlyReport = require('../models/MonthlyReport');
const Notification = require('../models/Notification');
const TutorProfile = require('../models/TutorProfile');
const { sanitizeTutorContact } = require('../middleware/contactPrivacy');
const { logAudit } = require('../middleware/audit');

// @desc    Get Parent Dashboard Overview
// @route   GET /api/parents/dashboard
// @access  Private (Parent)
const getParentDashboard = async (req, res, next) => {
  try {
    const parentId = req.user._id;

    const [studentsCount, requirementsCount, activeDemosCount, activeAssignments] = await Promise.all([
      Student.countDocuments({ parent: parentId }),
      TuitionRequirement.countDocuments({ postedBy: parentId }),
      DemoClass.countDocuments({ parent: parentId, status: { $in: ['SCHEDULED', 'COMPLETED'] } }),
      Assignment.find({ parent: parentId, status: 'ACTIVE' }).populate('tutor', 'name email phone avatar'),
    ]);

    // Recent reports
    const recentReports = await MonthlyReport.find({ parent: parentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('tutor', 'name');

    res.json({
      success: true,
      data: {
        stats: {
          studentsCount,
          requirementsCount,
          activeDemosCount,
          activeTutorsCount: activeAssignments.length,
        },
        activeAssignments,
        recentReports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Students for this Parent
// @route   GET /api/parents/students
// @access  Private (Parent)
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ parent: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new student
// @route   POST /api/parents/students
// @access  Private (Parent)
const createStudent = async (req, res, next) => {
  try {
    const { name, class: studentClass, school, syllabus, gender, dateOfBirth } = req.body;

    const student = await Student.create({
      parent: req.user._id,
      name,
      class: studentClass,
      school: school || '',
      syllabus: syllabus || 'CBSE',
      gender,
      dateOfBirth,
      parentContact: {
        phone: req.user.phone,
        email: req.user.email,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post Tuition Requirement (FR-P3)
// @route   POST /api/parents/requirements
// @access  Private (Parent)
const createRequirement = async (req, res, next) => {
  try {
    const { studentId, studentName, class: reqClass, school, syllabus, subject, location, salaryRange, teachingMode, eligibilityRules } = req.body;

    let targetStudentName = studentName;
    let targetStudent = null;

    if (studentId) {
      targetStudent = await Student.findOne({ _id: studentId, parent: req.user._id });
      if (targetStudent) {
        targetStudentName = targetStudent.name;
      }
    }

    const requirement = await TuitionRequirement.create({
      postedBy: req.user._id,
      postedRole: 'parent',
      student: targetStudent?._id,
      studentName: targetStudentName || 'Student',
      class: reqClass,
      school: school || targetStudent?.school || '',
      syllabus: syllabus || targetStudent?.syllabus || 'CBSE',
      subject,
      location,
      salaryRange,
      teachingMode: teachingMode || 'offline',
      eligibilityRules: eligibilityRules || '',
      status: 'SUBMITTED', // Submitted to Admin for review and publishing (FR-P3, FR-A2)
    });

    await logAudit({
      user: req.user._id,
      userRole: 'parent',
      action: 'REQUIREMENT_POSTED',
      targetType: 'TuitionRequirement',
      targetId: requirement._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Tuition requirement submitted successfully! Admin will review and list it for verified tutors.',
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Requirements posted by Parent
// @route   GET /api/parents/requirements
// @access  Private (Parent)
const getRequirements = async (req, res, next) => {
  try {
    const requirements = await TuitionRequirement.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedTutor', 'name email phone avatar');

    res.json({ success: true, data: requirements });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tutor Candidates / Applications for a Requirement (FR-P4, FR-P6 sanitized)
// @route   GET /api/parents/requirements/:id/candidates
// @access  Private (Parent)
const getRequirementCandidates = async (req, res, next) => {
  try {
    const requirement = await TuitionRequirement.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    const applications = await TutorApplication.find({ requirement: requirement._id })
      .populate('tutor', 'name avatar')
      .sort({ createdAt: -1 });

    // Sanitize tutor contact info (FR-P6) - phone and email are hidden before assignment + accepted demo
    const sanitizedCandidates = await Promise.all(
      applications.map(async (app) => {
        const tutorProfile = await TutorProfile.findOne({ user: app.tutor._id }).select(
          'qualification experience gender maxClassCanTeach teachingMode preferredLocations'
        );
        return {
          applicationId: app._id,
          status: app.status,
          appliedDate: app.appliedDate,
          tutor: {
            id: app.tutor._id,
            name: app.tutor.name,
            avatar: app.tutor.avatar,
            profile: tutorProfile,
          },
        };
      })
    );

    res.json({ success: true, data: sanitizedCandidates });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Demos for Parent
// @route   GET /api/parents/demos
// @access  Private (Parent)
const getDemos = async (req, res, next) => {
  try {
    const demos = await DemoClass.find({ parent: req.user._id })
      .populate('tutor', 'name avatar')
      .populate('requirement', 'class subject location syllabus')
      .sort({ date: -1 });

    // Sanitize tutor details if not formally assigned yet
    const sanitizedDemos = demos.map((d) => {
      const demoObj = d.toObject();
      if (d.parentDecision !== 'ACCEPTED' || d.status !== 'COMPLETED') {
        if (demoObj.tutor) {
          demoObj.tutor.phone = '***-***-**** (Available after acceptance & formal assignment)';
          demoObj.tutor.email = '***@***.*** (Available after acceptance & formal assignment)';
        }
      }
      return demoObj;
    });

    res.json({ success: true, data: sanitizedDemos });
  } catch (error) {
    next(error);
  }
};

// @desc    Parent Submits Demo Decision (Accept / Reject) (FR-P4.4)
// @route   POST /api/parents/demos/:id/decision
// @access  Private (Parent)
const submitDemoDecision = async (req, res, next) => {
  try {
    const { decision, notes } = req.body; // decision: 'ACCEPTED' | 'REJECTED'

    if (!['ACCEPTED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid decision. Must be ACCEPTED or REJECTED.',
      });
    }

    const demo = await DemoClass.findOne({ _id: req.params.id, parent: req.user._id });

    if (!demo) {
      return res.status(404).json({ success: false, message: 'Demo class not found' });
    }

    demo.parentDecision = decision;
    demo.parentDecisionDate = new Date();
    demo.parentNotes = notes || '';
    demo.status = 'COMPLETED';
    await demo.save();

    // Notify Admin of parent decision (FR-P4.5)
    await Notification.create({
      recipient: demo.tutor, // Note: Tutor does not receive direct decision from parent; Admin reviews and relays
      title: 'Demo Class Completed',
      message: 'Your demo class status has been updated and is under Admin review.',
      type: 'DEMO_COMPLETED',
      link: '/tutor/demos',
    });

    await logAudit({
      user: req.user._id,
      userRole: 'parent',
      action: `DEMO_${decision}_BY_PARENT`,
      targetType: 'DemoClass',
      targetId: demo._id,
      ipAddress: req.ip,
      metadata: { decision, notes },
    });

    res.json({
      success: true,
      message: `Demo outcome recorded as ${decision}. Admin will review and finalize the tutor assignment process.`,
      data: demo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Assigned Tutors (FR-P5.1 - full contact details revealed)
// @route   GET /api/parents/assigned-tutors
// @access  Private (Parent)
const getAssignedTutors = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({
      parent: req.user._id,
      status: 'ACTIVE',
    })
      .populate('tutor', 'name email phone avatar')
      .populate('requirement', 'class subject syllabus location salaryRange')
      .sort({ assignedDate: -1 });

    const assignmentsWithTutorProfiles = await Promise.all(
      assignments.map(async (asgn) => {
        const profile = await TutorProfile.findOne({ user: asgn.tutor._id });
        return {
          ...asgn.toObject(),
          tutorProfile: profile,
        };
      })
    );

    res.json({ success: true, data: assignmentsWithTutorProfiles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Attendance for Parent (FR-P5)
// @route   GET /api/parents/attendance
// @access  Private (Parent)
const getStudentAttendance = async (req, res, next) => {
  try {
    // Get all assignments for this parent
    const assignments = await Assignment.find({ parent: req.user._id });
    const assignmentIds = assignments.map((a) => a._id);

    const attendanceRecords = await Attendance.find({
      assignment: { $in: assignmentIds },
    })
      .populate('markedBy', 'name')
      .populate('assignment', 'studentName class subject')
      .sort({ date: -1 });

    res.json({ success: true, data: attendanceRecords });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Monthly Reports for Parent (FR-P5.2)
// @route   GET /api/parents/reports
// @access  Private (Parent)
const getMonthlyReports = async (req, res, next) => {
  try {
    const reports = await MonthlyReport.find({ parent: req.user._id })
      .populate('tutor', 'name email phone')
      .populate('assignment', 'studentName class subject')
      .sort({ year: -1, createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParentDashboard,
  getStudents,
  createStudent,
  createRequirement,
  getRequirements,
  getRequirementCandidates,
  getDemos,
  submitDemoDecision,
  getAssignedTutors,
  getStudentAttendance,
  getMonthlyReports,
};
