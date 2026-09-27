const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/tutorController');
const { protect } = require('../middleware/auth');
const { requireTutor, requireApprovedTutor } = require('../middleware/roles');
const { upload } = require('../config/upload');

// Apply auth & tutor role to all tutor routes
router.use(protect, requireTutor);

router.get('/dashboard', getTutorDashboard);
router.get('/requirements', getOpenRequirements);
router.post('/requirements/:id/apply', requireApprovedTutor, applyForRequirement);
router.get('/applications', getMyApplications);
router.get('/demos', getMyDemos);
router.get('/tuitions', getAssignedTuitions);
router.post('/attendance', markAttendance);
router.get('/attendance', getTutorAttendance);
router.post('/reports', submitMonthlyReport);
router.get('/reports', getTutorReports);
router.post('/earnings', logMonthlyEarning);
router.get('/earnings', getMonthlyEarnings);

// Subscriptions & Commission payment proof uploads
router.post('/subscriptions', upload.single('screenshot'), createSubscription);
router.get('/subscriptions', getTutorSubscriptions);
router.post('/commissions/upload', upload.single('screenshot'), uploadCommissionProof);
router.get('/commissions', getTutorCommissions);

module.exports = router;
