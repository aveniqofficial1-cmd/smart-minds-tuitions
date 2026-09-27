const TuitionCenter = require('../models/TuitionCenter');
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Performance = require('../models/Performance');
const FeeRecord = require('../models/FeeRecord');
const TuitionRequirement = require('../models/TuitionRequirement');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/audit');

// @desc    Get Tuition Center Dashboard Stats
// @route   GET /api/centers/dashboard
// @access  Private (Center)
const getCenterDashboard = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    if (!center) {
      return res.status(404).json({ success: false, message: 'Tuition Center not found' });
    }

    const [batchesCount, studentsCount, pendingFeesCount, recentPerformance] = await Promise.all([
      Batch.countDocuments({ center: center._id, status: 'ACTIVE' }),
      Student.countDocuments({ center: center._id }),
      FeeRecord.countDocuments({ center: center._id, status: { $in: ['PENDING', 'OVERDUE'] } }),
      Performance.find({ center: center._id })
        .populate('student', 'name class')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        center,
        stats: {
          batchesCount,
          studentsCount,
          pendingFeesCount,
          isApproved: center.status === 'approved',
        },
        recentPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Batches for Center (FR-C4.2)
// @route   GET /api/centers/batches
// @access  Private (Center)
const getBatches = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const batches = await Batch.find({ center: center._id })
      .populate('students', 'name class rollNo')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: batches });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a New Batch (Classes 1-10) (FR-C4.1, FR-C4.2)
// @route   POST /api/centers/batches
// @access  Private (Center)
const createBatch = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { name, classNumber, subject, tutorName, timing, maxStudents } = req.body;

    const batch = await Batch.create({
      center: center._id,
      name,
      classNumber: classNumber || 'Class 10',
      subject,
      tutorName,
      timing,
      maxStudents: Number(maxStudents) || 20,
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully!',
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Students enrolled in Center
// @route   GET /api/centers/students
// @access  Private (Center)
const getCenterStudents = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const students = await Student.find({ center: center._id })
      .populate('batch', 'name classNumber subject')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a Student to Center
// @route   POST /api/centers/students
// @access  Private (Center)
const addCenterStudent = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { name, class: studentClass, school, syllabus, rollNo, batchId, parentPhone, parentEmail } = req.body;

    const student = await Student.create({
      center: center._id,
      name,
      class: studentClass,
      school: school || '',
      syllabus: syllabus || 'CBSE',
      rollNo: rollNo || '',
      batch: batchId || null,
      parentContact: {
        phone: parentPhone || '',
        email: parentEmail || '',
      },
    });

    // If batch assigned, add student to batch
    if (batchId) {
      await Batch.findByIdAndUpdate(batchId, { $addToSet: { students: student._id } });
    }

    res.status(201).json({
      success: true,
      message: 'Student added to center successfully!',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Batch Attendance (FR-C4.3)
// @route   POST /api/centers/attendance
// @access  Private (Center)
const markBatchAttendance = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { batchId, date, attendanceList } = req.body; // attendanceList: [{ studentId, studentName, status, remarks }]

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const records = await Promise.all(
      attendanceList.map(async (item) => {
        return await Attendance.create({
          center: center._id,
          batch: batchId,
          student: item.studentId,
          studentName: item.studentName,
          markedBy: req.user._id,
          date: attendanceDate,
          status: item.status || 'PRESENT',
          remarks: item.remarks || '',
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `Attendance marked for ${records.length} students!`,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Center Attendance History
// @route   GET /api/centers/attendance
// @access  Private (Center)
const getCenterAttendance = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { batchId, date } = req.query;

    const query = { center: center._id };
    if (batchId) query.batch = batchId;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      query.date = d;
    }

    const records = await Attendance.find(query)
      .populate('student', 'name class rollNo')
      .populate('batch', 'name subject')
      .sort({ date: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Record Student Exam Performance (FR-C4.4, FR-C4.8)
// @route   POST /api/centers/performance
// @access  Private (Center)
const recordPerformance = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { studentId, batchId, examName, subject, maxMarks, marksObtained, grade, remarks, examDate } = req.body;

    const performance = await Performance.create({
      center: center._id,
      student: studentId,
      batch: batchId,
      examName,
      subject,
      maxMarks: Number(maxMarks) || 100,
      marksObtained: Number(marksObtained),
      grade: grade || '',
      remarks: remarks || '',
      examDate: examDate ? new Date(examDate) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Exam performance record added successfully!',
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Performance Report to Parent (FR-C4.5)
// @route   POST /api/centers/performance/:id/send
// @access  Private (Center)
const sendPerformanceToParent = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const performance = await Performance.findOne({ _id: req.params.id, center: center._id }).populate('student');

    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance record not found' });
    }

    performance.sentToParent = true;
    performance.sentAt = new Date();
    await performance.save();

    await logAudit({
      user: req.user._id,
      userRole: 'center',
      action: 'PERFORMANCE_SENT_TO_PARENT',
      targetType: 'Performance',
      targetId: performance._id,
      ipAddress: req.ip,
      metadata: { studentName: performance.student?.name, examName: performance.examName },
    });

    res.json({
      success: true,
      message: `Performance report for ${performance.student?.name} marked as sent to parent successfully!`,
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Performance Records for Center
// @route   GET /api/centers/performance
// @access  Private (Center)
const getCenterPerformance = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const records = await Performance.find({ center: center._id })
      .populate('student', 'name class rollNo')
      .populate('batch', 'name subject')
      .sort({ examDate: -1, createdAt: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Fee Records for Center (FR-C4.6)
// @route   GET /api/centers/fees
// @access  Private (Center)
const getFeeRecords = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const fees = await FeeRecord.find({ center: center._id })
      .populate('student', 'name class rollNo parentContact')
      .sort({ dueDate: -1, createdAt: -1 });

    res.json({ success: true, data: fees });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Fee Record for Student (FR-C4.6)
// @route   POST /api/centers/fees
// @access  Private (Center)
const createFeeRecord = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { studentId, studentName, amount, month, year, dueDate, remarks } = req.body;

    const fee = await FeeRecord.create({
      center: center._id,
      student: studentId,
      studentName: studentName || 'Student',
      amount: Number(amount),
      month,
      year: Number(year) || new Date().getFullYear(),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      remarks: remarks || '',
    });

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully!',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Fee Payment Status
// @route   PUT /api/centers/fees/:id
// @access  Private (Center)
const updateFeeStatus = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { status, remarks } = req.body; // status: 'PAID' | 'PENDING' | 'OVERDUE'

    const fee = await FeeRecord.findOne({ _id: req.params.id, center: center._id });
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    fee.status = status;
    if (status === 'PAID') fee.paidDate = new Date();
    if (remarks) fee.remarks = remarks;
    await fee.save();

    res.json({
      success: true,
      message: `Fee record status updated to ${status}!`,
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually Send Fee Reminder to Parent (FR-C4.7)
// @route   POST /api/centers/fees/:id/remind
// @access  Private (Center)
const sendFeeReminder = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const fee = await FeeRecord.findOne({ _id: req.params.id, center: center._id });

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    fee.lastReminderSentAt = new Date();
    await fee.save();

    await logAudit({
      user: req.user._id,
      userRole: 'center',
      action: 'FEE_REMINDER_SENT_MANUALLY',
      targetType: 'FeeRecord',
      targetId: fee._id,
      ipAddress: req.ip,
      metadata: { studentName: fee.studentName, month: fee.month, amount: fee.amount },
    });

    res.json({
      success: true,
      message: `Fee reminder sent for ${fee.studentName} (${fee.month})!`,
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post Tutor Requirement to Admin's Tutor Pool (FR-C3)
// @route   POST /api/centers/tutor-requirements
// @access  Private (Center)
const postTutorRequirement = async (req, res, next) => {
  try {
    const center = await TuitionCenter.findOne({ user: req.user._id });
    const { class: reqClass, salary, eligibilityRules, location, subject, teachingMode } = req.body;

    const requirement = await TuitionRequirement.create({
      postedBy: req.user._id,
      postedRole: 'center',
      studentName: `${center.centerName} (Batch Requirement)`,
      class: reqClass,
      school: center.centerName,
      syllabus: 'CBSE',
      subject: subject || 'Subject Instructor',
      location: location || center.address?.area || 'Tuition Center',
      salaryRange: salary,
      teachingMode: teachingMode || 'offline',
      eligibilityRules: eligibilityRules || '',
      status: 'SUBMITTED', // Submitted to Admin for listing
    });

    await logAudit({
      user: req.user._id,
      userRole: 'center',
      action: 'CENTER_POSTED_TUTOR_REQUIREMENT',
      targetType: 'TuitionRequirement',
      targetId: requirement._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Tutor request submitted to Admin! Verified tutors will be matched by Admin.',
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCenterDashboard,
  getBatches,
  createBatch,
  getCenterStudents,
  addCenterStudent,
  markBatchAttendance,
  getCenterAttendance,
  recordPerformance,
  sendPerformanceToParent,
  getCenterPerformance,
  getFeeRecords,
  createFeeRecord,
  updateFeeStatus,
  sendFeeReminder,
  postTutorRequirement,
};
