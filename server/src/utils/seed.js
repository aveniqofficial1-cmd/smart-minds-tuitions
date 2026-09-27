const mongoose = require('mongoose');
const User = require('../models/User');
const ParentProfile = require('../models/ParentProfile');
const TutorProfile = require('../models/TutorProfile');
const TuitionCenter = require('../models/TuitionCenter');
const Student = require('../models/Student');
const TuitionRequirement = require('../models/TuitionRequirement');
const TutorApplication = require('../models/TutorApplication');
const DemoClass = require('../models/DemoClass');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const MonthlyReport = require('../models/MonthlyReport');
const Subscription = require('../models/Subscription');
const CommissionPayment = require('../models/CommissionPayment');
const Batch = require('../models/Batch');
const Performance = require('../models/Performance');
const FeeRecord = require('../models/FeeRecord');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    console.log('[Seed] Clearing existing development database collections...');
    await Promise.all([
      User.deleteMany(),
      ParentProfile.deleteMany(),
      TutorProfile.deleteMany(),
      TuitionCenter.deleteMany(),
      Student.deleteMany(),
      TuitionRequirement.deleteMany(),
      TutorApplication.deleteMany(),
      DemoClass.deleteMany(),
      Assignment.deleteMany(),
      Attendance.deleteMany(),
      MonthlyReport.deleteMany(),
      Subscription.deleteMany(),
      CommissionPayment.deleteMany(),
      Batch.deleteMany(),
      Performance.deleteMany(),
      FeeRecord.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany(),
      Notification.deleteMany(),
      AuditLog.deleteMany(),
    ]);

    console.log('[Seed] Creating 1 Admin, 2 Tutors, 2 Parents, 1 Tuition Center...');

    // 1. Admin (Pre-provisioned)
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Platform Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@smartmindstuitions.com').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'AdminPass@2026!',
      role: 'admin',
      status: 'active',
      phone: '+919876543210',
    });

    // 2. Tutors
    // Tutor 1: Approved Tutor (Priya Sharma)
    const tutorUser1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@tutors.com',
      password: 'TutorPass@2026!',
      role: 'tutor',
      status: 'approved',
      phone: '+919845012345',
    });

    const tutorProfile1 = await TutorProfile.create({
      user: tutorUser1._id,
      age: 28,
      qualification: 'M.Sc in Mathematics & B.Ed',
      whatsappNumber: '+919845012345',
      experience: '5+ years of secondary & higher secondary teaching',
      gender: 'Female',
      preferredLocations: ['Madhapur', 'Jubilee Hills', 'Gachibowli', 'Banjara Hills', 'Kondapur'],
      maxClassCanTeach: 'Class 12',
      teachingMode: 'both',
      documents: {
        aadhar: 'sample-aadhar-priya.pdf',
        photo: 'sample-photo-priya.jpg',
        pan: 'sample-pan-priya.pdf',
        memos: ['sample-degree-msc.pdf', 'sample-bed-cert.pdf'],
      },
      agreementAccepted: true,
      agreementAcceptedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'approved',
      verifiedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      verifiedBy: admin._id,
      selfReportedEarnings: [
        {
          month: 'August',
          year: 2026,
          amount: 8000,
          studentName: 'Rohan Gupta',
          notes: 'Offline home tuition monthly fee received',
        },
      ],
    });

    // Tutor 2: Pending Tutor (Rahul Verma)
    const tutorUser2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@tutors.com',
      password: 'TutorPass@2026!',
      role: 'tutor',
      status: 'pending',
      phone: '+919711223344',
    });

    const tutorProfile2 = await TutorProfile.create({
      user: tutorUser2._id,
      age: 25,
      qualification: 'B.Tech in Computer Science & Physics Enthusiast',
      whatsappNumber: '+919711223344',
      experience: '2 years teaching ICSE and CBSE Science',
      gender: 'Male',
      preferredLocations: ['Hitec City', 'Kukatpally', 'Miyapur'],
      maxClassCanTeach: 'Class 10',
      teachingMode: 'offline',
      documents: {
        aadhar: 'sample-aadhar-rahul.pdf',
        photo: 'sample-photo-rahul.jpg',
        memos: ['sample-btech-degree.pdf'],
      },
      agreementAccepted: true,
      agreementAcceptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
    });

    // 3. Parents & Students
    // Parent 1: Sunita Reddy (Mother of Aarav Reddy)
    const parentUser1 = await User.create({
      name: 'Sunita Reddy',
      email: 'sunita.reddy@parents.com',
      password: 'ParentPass@2026!',
      role: 'parent',
      status: 'active',
      phone: '+919888123456',
    });

    await ParentProfile.create({
      user: parentUser1._id,
      studentName: 'Aarav Reddy',
      motherName: 'Sunita Reddy',
      fatherName: 'Venkatesh Reddy',
      mobileNumber: '+919888123456',
      address: {
        street: 'Villa 42, Green Meadows',
        area: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081',
      },
    });

    const student1 = await Student.create({
      parent: parentUser1._id,
      name: 'Aarav Reddy',
      class: 'Class 10',
      school: 'Oakridge International School',
      syllabus: 'CBSE',
      gender: 'Male',
      parentContact: {
        phone: '+919888123456',
        email: 'sunita.reddy@parents.com',
      },
    });

    // Parent 2: Vikram Mehta (Father of Ananya Mehta)
    const parentUser2 = await User.create({
      name: 'Vikram Mehta',
      email: 'vikram.mehta@parents.com',
      password: 'ParentPass@2026!',
      role: 'parent',
      status: 'active',
      phone: '+919777654321',
    });

    await ParentProfile.create({
      user: parentUser2._id,
      studentName: 'Ananya Mehta',
      fatherName: 'Vikram Mehta',
      motherName: 'Meera Mehta',
      mobileNumber: '+919777654321',
      address: {
        street: 'Flat 302, Palm Heights',
        area: 'Jubilee Hills',
        city: 'Hyderabad',
        pincode: '500033',
      },
    });

    const student2 = await Student.create({
      parent: parentUser2._id,
      name: 'Ananya Mehta',
      class: 'Class 9',
      school: 'Hyderabad Public School',
      syllabus: 'ICSE',
      gender: 'Female',
      parentContact: {
        phone: '+919777654321',
        email: 'vikram.mehta@parents.com',
      },
    });

    // 4. Tuition Center (Apex Scholars Tuition Center)
    const centerUser = await User.create({
      name: 'Apex Scholars Tuition Center',
      email: 'apex.academy@centers.com',
      password: 'CenterPass@2026!',
      role: 'center',
      status: 'approved',
      phone: '+919666001122',
    });

    const tuitionCenter = await TuitionCenter.create({
      user: centerUser._id,
      centerName: 'Apex Scholars Tuition Center',
      principalName: 'Dr. K. Srinivas Rao',
      email: 'apex.academy@centers.com',
      mobileNumber: '+919666001122',
      address: {
        street: 'Plot 104, Main Commercial Complex',
        area: 'Gachibowli',
        city: 'Hyderabad',
        pincode: '500032',
        state: 'Telangana',
      },
      documents: ['apex-registration-cert.pdf', 'apex-tax-id.pdf'],
      status: 'approved',
      verifiedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      verifiedBy: admin._id,
    });

    // Create center batch & students
    const batch1 = await Batch.create({
      center: tuitionCenter._id,
      name: 'Class 10 - Mathematics Advanced Batch',
      classNumber: 'Class 10',
      subject: 'Mathematics',
      tutorName: 'Prof. Ramesh K.',
      timing: 'Mon, Wed, Fri 5:00 PM - 6:30 PM',
      maxStudents: 15,
    });

    const centerStudent1 = await Student.create({
      center: tuitionCenter._id,
      name: 'Karthik Raja',
      class: 'Class 10',
      school: 'Delhi Public School',
      syllabus: 'CBSE',
      rollNo: 'DPS-104',
      batch: batch1._id,
      parentContact: { phone: '+919123456789', email: 'raja.parent@test.com' },
    });

    batch1.students.push(centerStudent1._id);
    await batch1.save();

    // Center Performance Record
    await Performance.create({
      center: tuitionCenter._id,
      student: centerStudent1._id,
      batch: batch1._id,
      examName: 'Midterm Assessment 1',
      subject: 'Mathematics',
      maxMarks: 100,
      marksObtained: 92,
      grade: 'A+',
      remarks: 'Excellent problem solving in Quadratic Equations and Trigonometry.',
      sentToParent: true,
      sentAt: new Date(),
    });

    // Center Fee Record
    await FeeRecord.create({
      center: tuitionCenter._id,
      student: centerStudent1._id,
      studentName: 'Karthik Raja',
      amount: 3500,
      month: 'September',
      year: 2026,
      status: 'PAID',
      dueDate: new Date(2026, 8, 10),
      paidDate: new Date(2026, 8, 8),
      remarks: 'Paid on time via UPI',
    });

    // 5. Tuition Requirements (3 Requirements per prompt)
    // Requirement 1: Open/Published Requirement (Parent: Sunita Reddy)
    const req1 = await TuitionRequirement.create({
      postedBy: parentUser1._id,
      postedRole: 'parent',
      student: student1._id,
      studentName: 'Aarav Reddy',
      class: 'Class 10',
      school: 'Oakridge International School',
      syllabus: 'CBSE',
      subject: 'Mathematics & Science',
      location: 'Madhapur, Hyderabad',
      salaryRange: '₹7,500 - ₹9,000 / month',
      teachingMode: 'offline',
      eligibilityRules: 'Female or Male tutor with minimum 3 years CBSE experience.',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    // Requirement 2: Requirement with Applications & Scheduled Demo (Parent: Vikram Mehta)
    const req2 = await TuitionRequirement.create({
      postedBy: parentUser2._id,
      postedRole: 'parent',
      student: student2._id,
      studentName: 'Ananya Mehta',
      class: 'Class 9',
      school: 'Hyderabad Public School',
      syllabus: 'ICSE',
      subject: 'Physics & Chemistry',
      location: 'Jubilee Hills, Hyderabad',
      salaryRange: '₹8,000 - ₹10,000 / month',
      teachingMode: 'both',
      eligibilityRules: 'Experienced in ICSE curriculum with focus on analytical concepts.',
      status: 'DEMO_SCHEDULED',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    // Tutor Application for Req 2
    await TutorApplication.create({
      tutor: tutorUser1._id,
      requirement: req2._id,
      status: 'DEMO_SCHEDULED',
      demoStatus: 'SCHEDULED',
      proposalMessage: 'I have 5 years experience specifically teaching ICSE board sciences with stellar student results.',
    });

    // Demo class for Req 2
    await DemoClass.create({
      requirement: req2._id,
      tutor: tutorUser1._id,
      parent: parentUser2._id,
      studentName: 'Ananya Mehta',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '05:30 PM',
      location: 'Flat 302, Palm Heights, Jubilee Hills',
      mode: 'offline',
      status: 'SCHEDULED',
      parentDecision: 'PENDING',
      adminRelayedStatus: 'PENDING',
    });

    // Requirement 3: Assigned Requirement (Parent: Sunita Reddy, assigned to Priya Sharma)
    const req3 = await TuitionRequirement.create({
      postedBy: parentUser1._id,
      postedRole: 'parent',
      studentName: 'Aarav Reddy (Foundation Batch)',
      class: 'Class 10',
      school: 'Oakridge International School',
      syllabus: 'CBSE',
      subject: 'Advanced Mathematics',
      location: 'Madhapur, Hyderabad',
      salaryRange: '₹8,000 / month',
      teachingMode: 'offline',
      status: 'ASSIGNED',
      assignedTutor: tutorUser1._id,
      assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    });

    // Completed Demo for Req 3
    await DemoClass.create({
      requirement: req3._id,
      tutor: tutorUser1._id,
      parent: parentUser1._id,
      studentName: 'Aarav Reddy',
      date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      time: '04:00 PM',
      location: 'Villa 42, Green Meadows, Madhapur',
      mode: 'offline',
      status: 'COMPLETED',
      parentDecision: 'ACCEPTED',
      parentDecisionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      adminRelayedStatus: 'ACCEPTED',
      adminRelayedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    });

    // Formal Assignment for Req 3 (Triggers Contact Details Revelation)
    const assignment1 = await Assignment.create({
      requirement: req3._id,
      tutor: tutorUser1._id,
      parent: parentUser1._id,
      student: student1._id,
      studentName: 'Aarav Reddy',
      class: 'Class 10',
      subject: 'Advanced Mathematics',
      monthlySalary: 8000,
      assignedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      contactVisibilityGranted: true,
    });

    // First Month 50% Commission Record (FR-T4.1, FR-A4.2: 50% of 8000 = 4000)
    await CommissionPayment.create({
      tutor: tutorUser1._id,
      assignment: assignment1._id,
      studentName: 'Aarav Reddy',
      firstMonthSalary: 8000,
      commissionAmount: 4000,
      paymentScreenshot: 'sample-commission-screenshot.png',
      transactionRef: 'UPI-TXN-98450123-COMM',
      status: 'PAID',
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      verifiedBy: admin._id,
    });

    // Active Multi-tuition Subscription for Priya Sharma (FR-T3.5, FR-A4.1: Rs. 600 - 6 Months)
    await Subscription.create({
      tutor: tutorUser1._id,
      planName: '6 Months',
      durationMonths: 6,
      amount: 600,
      paymentScreenshot: 'sample-sub-screenshot.png',
      transactionRef: 'UPI-TXN-SUB-600-PRIYA',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 166 * 24 * 60 * 60 * 1000),
      submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      verifiedBy: admin._id,
    });

    // Attendance records for Assignment 1
    const today = new Date();
    for (let i = 5; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 2);
      await Attendance.create({
        assignment: assignment1._id,
        student: student1._id,
        studentName: 'Aarav Reddy',
        markedBy: tutorUser1._id,
        date: d,
        status: 'PRESENT',
        topicCovered: `Chapter ${6 - i}: Polynomials & Linear Equations practice`,
        remarks: 'Good grasp of fundamentals.',
      });
    }

    // Monthly Report for Assignment 1 (FR-T4.4, FR-P5.2)
    await MonthlyReport.create({
      assignment: assignment1._id,
      student: student1._id,
      studentName: 'Aarav Reddy',
      tutor: tutorUser1._id,
      parent: parentUser1._id,
      month: 'August',
      year: 2026,
      attendanceCount: 12,
      totalClasses: 12,
      syllabusCovered: 'Quadratic Equations, Coordinate Geometry, Triangles',
      marks: '48 / 50 in Chapter Test 1',
      remarks: 'Aarav is very attentive and solves problems quickly. Excellent progress in Mathematics.',
    });

    // 6. Chat Conversations & Messages
    const conv1 = await Conversation.create({
      participants: [tutorUser1._id, admin._id],
      participantDetails: [
        { user: tutorUser1._id, role: 'tutor', name: tutorUser1.name },
        { user: admin._id, role: 'admin', name: admin.name },
      ],
      lastMessageText: 'Hello Priya, your 50% first-month commission payment has been verified.',
      lastMessageAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    });

    await Message.create({
      conversation: conv1._id,
      sender: tutorUser1._id,
      senderRole: 'tutor',
      text: 'Hello Admin! I have uploaded the first-month commission payment screenshot for Aarav Reddy.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      read: true,
    });

    await Message.create({
      conversation: conv1._id,
      sender: admin._id,
      senderRole: 'admin',
      text: 'Hello Priya, your 50% first-month commission payment has been verified. You can now keep 100% of the tuition fees for remaining months directly from the parent.',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      read: true,
    });

    // 7. Audit Logs
    await AuditLog.create({
      user: admin._id,
      userRole: 'admin',
      action: 'PLATFORM_SEEDED',
      targetType: 'System',
      ipAddress: '127.0.0.1',
      metadata: { description: 'Development baseline seed data generated' },
    });

    console.log('[Seed] Database successfully seeded with full development & testing dataset!');
    console.log('======================================================');
    console.log('  TEST CREDENTIALS (IDENTIFIED FOR DEVELOPMENT):');
    console.log('  Admin:          admin@smartmindstuitions.com / AdminPass@2026!');
    console.log('  Approved Tutor: priya.sharma@tutors.com      / TutorPass@2026!');
    console.log('  Pending Tutor:  rahul.verma@tutors.com       / TutorPass@2026!');
    console.log('  Parent 1:       sunita.reddy@parents.com     / ParentPass@2026!');
    console.log('  Parent 2:       vikram.mehta@parents.com     / ParentPass@2026!');
    console.log('  Tuition Center: apex.academy@centers.com     / CenterPass@2026!');
    console.log('======================================================');
  } catch (error) {
    console.error('[Seed] Seeding failed:', error.message);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('[Seed] No Admin found in database. Running initial seed...');
      await seedData();
    }
  } catch (err) {
    console.warn('[Seed] Auto seed check skipped:', err.message);
  }
};

// If run directly via `node src/utils/seed.js`
if (require.main === module) {
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}

module.exports = { seedData, autoSeedIfEmpty };
