const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const ParentProfile = require('../src/models/ParentProfile');
const TutorProfile = require('../src/models/TutorProfile');

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('Auth Module: Parent Registration & Duplicate Email Prevention', async () => {
  const email = 'test.parent@test.com';

  // Register user
  const user = await User.create({
    name: 'Test Parent',
    email,
    password: 'Password123!',
    role: 'parent',
    phone: '9876543210',
    status: 'active',
  });

  assert.strictEqual(user.role, 'parent');
  assert.strictEqual(user.status, 'active');

  // Verify password hashing
  const isMatch = await user.matchPassword('Password123!');
  assert.strictEqual(isMatch, true);
  const isWrong = await user.matchPassword('WrongPassword');
  assert.strictEqual(isWrong, false);

  // Duplicate email check
  let duplicateError = false;
  try {
    await User.create({
      name: 'Another User',
      email,
      password: 'Password123!',
      role: 'parent',
    });
  } catch (err) {
    duplicateError = true;
  }
  assert.strictEqual(duplicateError, true, 'Duplicate email should be rejected');
});

test('Auth Module: Tutor Registration with Agreement and Pending Verification', async () => {
  const tutorUser = await User.create({
    name: 'New Tutor',
    email: 'new.tutor@test.com',
    password: 'Password123!',
    role: 'tutor',
    phone: '9876543211',
    status: 'pending',
  });

  const profile = await TutorProfile.create({
    user: tutorUser._id,
    age: 26,
    qualification: 'M.Sc Physics',
    whatsappNumber: '9876543211',
    experience: '3 years',
    gender: 'Male',
    maxClassCanTeach: 'Class 12',
    teachingMode: 'both',
    agreementAccepted: true,
    agreementAcceptedAt: new Date(),
    status: 'pending',
  });

  assert.strictEqual(tutorUser.status, 'pending');
  assert.strictEqual(profile.status, 'pending');
  assert.strictEqual(profile.agreementAccepted, true);
});
