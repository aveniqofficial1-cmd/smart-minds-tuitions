const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

// Apply auth & admin role to all admin routes
router.use(protect, requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/requirements', getAllRequirements);
router.put('/requirements/:id/status', updateRequirementStatus);
router.get('/requirements/:id/applications', getRequirementApplications);

router.get('/tutors', getAllTutors);
router.put('/tutors/:id/status', updateTutorStatus);

router.get('/centers', getAllCenters);
router.put('/centers/:id/status', updateCenterStatus);

router.post('/demos/schedule', scheduleDemo);
router.put('/demos/:id/relay', relayDemoOutcome);

router.post('/assignments', assignTutor);
router.get('/assignments', getAllAssignments);

router.get('/subscriptions', getAllSubscriptions);
router.put('/subscriptions/:id/verify', verifySubscription);

router.get('/commissions', getAllCommissions);
router.put('/commissions/:id/verify', verifyCommission);

router.get('/earnings', getMonthlyEarningsBreakdown);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
