const express = require('express');
const router = express.Router();
const {
  registerParent,
  registerTutor,
  registerCenter,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/upload');

// Public routes
router.post('/register/parent', registerParent);

router.post(
  '/register/tutor',
  upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'memos', maxCount: 5 },
  ]),
  registerTutor
);

router.post(
  '/register/center',
  upload.fields([{ name: 'documents', maxCount: 5 }]),
  registerCenter
);

router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
