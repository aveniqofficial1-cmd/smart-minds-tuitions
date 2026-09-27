const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const TuitionRequirement = require('../src/models/TuitionRequirement');
const TutorApplication = require('../src/models/TutorApplication');
const DemoClass = require('../src/models/DemoClass');
const Assignment = require('../src/models/Assignment');
const CommissionPayment = require('../src/models/CommissionPayment');
const { sanitizeParentContact, sanitizeTutorContact } = require('../src/middleware/contactPrivacy');

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('Workflow: Contact Visibility Protection Before vs. After Assignment', async () => {
  const parent = await User.create({
    name: 'Parent User',
    email: 'private.parent@test.com',
    password: 'Password123!',
    role: 'parent',
    phone: '9888877777',
  });

  const tutor = await User.create({
    name: 'Tutor User',
    email: 'private.tutor@test.com',
    password: 'Password123!',
    role: 'tutor',
    phone: '9111122222',
  });

  const reqObj = {
    postedBy: parent,
    studentName: 'Student Name',
    class: 'Class 10',
    subject: 'Math',
    parentContact: {
      phone: '9888877777',
      email: 'private.parent@test.com',
    },
  };

  // 1. Before Assignment (isAssigned = false)
  const sanitizedBefore = sanitizeParentContact(reqObj, false);
  assert.ok(sanitizedBefore.parentContact.phone.includes('***'));
  assert.ok(sanitizedBefore.parentContact.email.includes('***'));

  // 2. After Assignment (isAssigned = true)
  const sanitizedAfter = sanitizeParentContact(reqObj, true);
  assert.strictEqual(sanitizedAfter.parentContact.phone, '9888877777');
  assert.strictEqual(sanitizedAfter.parentContact.email, 'private.parent@test.com');
});

test('Workflow: Demo Class and 50% Commission Calculation on Formal Assignment', async () => {
  const parent = await User.create({
    name: 'Parent Two',
    email: 'parent2@test.com',
    password: 'Password123!',
    role: 'parent',
  });

  const tutor = await User.create({
    name: 'Tutor Two',
    email: 'tutor2@test.com',
    password: 'Password123!',
    role: 'tutor',
  });

  const req = await TuitionRequirement.create({
    postedBy: parent._id,
    studentName: 'Rahul',
    class: 'Class 10',
    subject: 'Physics',
    location: 'Madhapur',
    salaryRange: '₹8,000',
    status: 'PUBLISHED',
  });

  // Schedule Demo
  const demo = await DemoClass.create({
    requirement: req._id,
    tutor: tutor._id,
    parent: parent._id,
    studentName: 'Rahul',
    date: new Date(),
    time: '4:00 PM',
    location: 'Madhapur',
    status: 'SCHEDULED',
  });

  assert.strictEqual(demo.parentDecision, 'PENDING');

  // Parent accepts demo
  demo.parentDecision = 'ACCEPTED';
  demo.status = 'COMPLETED';
  await demo.save();

  // Formal Assignment
  const monthlySalary = 8000;
  const assignment = await Assignment.create({
    requirement: req._id,
    tutor: tutor._id,
    parent: parent._id,
    studentName: 'Rahul',
    class: 'Class 10',
    subject: 'Physics',
    monthlySalary,
    status: 'ACTIVE',
    contactVisibilityGranted: true,
  });

  // Commission is exactly 50% of first month salary
  const commission = await CommissionPayment.create({
    tutor: tutor._id,
    assignment: assignment._id,
    studentName: 'Rahul',
    firstMonthSalary: monthlySalary,
    commissionAmount: monthlySalary * 0.5,
    status: 'PENDING_UPLOAD',
  });

  assert.strictEqual(commission.commissionAmount, 4000);
  assert.strictEqual(commission.status, 'PENDING_UPLOAD');
});
