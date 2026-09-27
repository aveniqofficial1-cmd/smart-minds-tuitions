const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/parentController');
const { protect } = require('../middleware/auth');
const { requireParent } = require('../middleware/roles');

// Apply auth & parent role to all parent routes
router.use(protect, requireParent);

router.get('/dashboard', getParentDashboard);
router.get('/students', getStudents);
router.post('/students', createStudent);
router.get('/requirements', getRequirements);
router.post('/requirements', createRequirement);
router.get('/requirements/:id/candidates', getRequirementCandidates);
router.get('/demos', getDemos);
router.post('/demos/:id/decision', submitDemoDecision);
router.get('/assigned-tutors', getAssignedTutors);
router.get('/attendance', getStudentAttendance);
router.get('/reports', getMonthlyReports);

module.exports = router;
