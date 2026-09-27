const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/centerController');
const { protect } = require('../middleware/auth');
const { requireCenter, requireApprovedCenter } = require('../middleware/roles');

router.use(protect, requireCenter);

router.get('/dashboard', getCenterDashboard);

// Independent center operational routes (require approved center status)
router.get('/batches', requireApprovedCenter, getBatches);
router.post('/batches', requireApprovedCenter, createBatch);
router.get('/students', requireApprovedCenter, getCenterStudents);
router.post('/students', requireApprovedCenter, addCenterStudent);
router.post('/attendance', requireApprovedCenter, markBatchAttendance);
router.get('/attendance', requireApprovedCenter, getCenterAttendance);
router.post('/performance', requireApprovedCenter, recordPerformance);
router.post('/performance/:id/send', requireApprovedCenter, sendPerformanceToParent);
router.get('/performance', requireApprovedCenter, getCenterPerformance);
router.get('/fees', requireApprovedCenter, getFeeRecords);
router.post('/fees', requireApprovedCenter, createFeeRecord);
router.put('/fees/:id', requireApprovedCenter, updateFeeStatus);
router.post('/fees/:id/remind', requireApprovedCenter, sendFeeReminder);

// Post tutor requirement to Admin pool
router.post('/tutor-requirements', requireApprovedCenter, postTutorRequirement);

module.exports = router;
