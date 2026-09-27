const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ParentProfile = require('../models/ParentProfile');
const TutorProfile = require('../models/TutorProfile');
const TuitionCenter = require('../models/TuitionCenter');
const Student = require('../models/Student');
const { logAudit } = require('../middleware/audit');

// Helper to generate signed JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'smart_minds_tuitions_super_secure_jwt_secret_key_2026_educate',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new Parent/Student
// @route   POST /api/auth/register/parent
// @access  Public
const registerParent = async (req, res, next) => {
  try {
    const { studentName, parentName, email, password, mobileNumber, motherName, fatherName, guardianName, address } = req.body;

    // Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in or use another email.',
      });
    }

    // Create user
    const user = await User.create({
      name: parentName || studentName,
      email: email.toLowerCase(),
      password,
      role: 'parent',
      phone: mobileNumber,
      status: 'active',
    });

    // Create ParentProfile
    const parentProfile = await ParentProfile.create({
      user: user._id,
      studentName,
      motherName: motherName || '',
      fatherName: fatherName || '',
      guardianName: guardianName || parentName,
      mobileNumber,
      address: address || {},
    });

    // Optionally create first student if provided
    if (studentName) {
      await Student.create({
        parent: user._id,
        name: studentName,
        class: req.body.class || 'Class 10',
        school: req.body.school || '',
        syllabus: req.body.syllabus || 'CBSE',
        parentContact: {
          phone: mobileNumber,
          email: email.toLowerCase(),
        },
      });
    }

    await logAudit({
      user: user._id,
      userRole: 'parent',
      action: 'PARENT_REGISTERED',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Parent registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        profile: parentProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Tutor
// @route   POST /api/auth/register/tutor
// @access  Public
const registerTutor = async (req, res, next) => {
  try {
    const {
      name,
      age,
      qualification,
      whatsappNumber,
      experience,
      email,
      password,
      gender,
      preferredLocations,
      maxClassCanTeach,
      teachingMode,
      agreementAccepted,
    } = req.body;

    // Check mandatory agreement acceptance
    if (agreementAccepted !== true && agreementAccepted !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'You must read and accept the Tutor Agreement before registering.',
      });
    }

    // Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Duplicate tutor registrations are not permitted.',
      });
    }

    // Handle uploaded KYC files
    const documents = {
      aadhar: req.files?.aadhar?.[0]?.filename || req.body.aadharDoc || '',
      photo: req.files?.photo?.[0]?.filename || req.body.photoDoc || '',
      pan: req.files?.pan?.[0]?.filename || req.body.panDoc || '',
      memos: req.files?.memos?.map((f) => f.filename) || (req.body.memoDocs ? [req.body.memoDocs] : []),
    };

    // Create user (status: pending verification)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'tutor',
      phone: whatsappNumber,
      status: 'pending',
    });

    // Parse preferred locations if passed as JSON string
    let parsedLocations = [];
    if (Array.isArray(preferredLocations)) {
      parsedLocations = preferredLocations;
    } else if (typeof preferredLocations === 'string') {
      try {
        parsedLocations = JSON.parse(preferredLocations);
      } catch {
        parsedLocations = preferredLocations.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const tutorProfile = await TutorProfile.create({
      user: user._id,
      age: Number(age),
      qualification,
      whatsappNumber,
      experience,
      gender,
      preferredLocations: parsedLocations,
      maxClassCanTeach,
      teachingMode: teachingMode || 'both',
      documents,
      agreementAccepted: true,
      agreementAcceptedAt: new Date(),
      status: 'pending',
    });

    await logAudit({
      user: user._id,
      userRole: 'tutor',
      action: 'TUTOR_REGISTERED_PENDING_VERIFICATION',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Tutor registration submitted! Your account is in Pending Verification status. Admin will review your KYC documents and agreement.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        profile: tutorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Tuition Center
// @route   POST /api/auth/register/center
// @access  Public
const registerCenter = async (req, res, next) => {
  try {
    const { centerName, principalName, email, password, mobileNumber, address } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Center documents
    const documents = req.files?.documents?.map((f) => f.filename) || (req.body.centerDocs ? [req.body.centerDocs] : []);

    let parsedAddress = address;
    if (typeof address === 'string') {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        parsedAddress = { street: address };
      }
    }

    // Create user (status: pending verification)
    const user = await User.create({
      name: centerName,
      email: email.toLowerCase(),
      password,
      role: 'center',
      phone: mobileNumber,
      status: 'pending',
    });

    const tuitionCenter = await TuitionCenter.create({
      user: user._id,
      centerName,
      principalName,
      email: email.toLowerCase(),
      mobileNumber,
      address: parsedAddress,
      documents,
      status: 'pending',
    });

    await logAudit({
      user: user._id,
      userRole: 'center',
      action: 'CENTER_REGISTERED_PENDING_VERIFICATION',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Tuition Center registered successfully! Account is pending document verification by Admin.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        center: tuitionCenter,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (All roles via Role Selector)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Optional role check if frontend specified role tab
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role.toUpperCase()}', not '${role.toUpperCase()}'. Please select the correct login tab.`,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Fetch related profile details
    let profileData = null;
    if (user.role === 'parent') {
      profileData = await ParentProfile.findOne({ user: user._id });
    } else if (user.role === 'tutor') {
      profileData = await TutorProfile.findOne({ user: user._id });
    } else if (user.role === 'center') {
      profileData = await TuitionCenter.findOne({ user: user._id });
    }

    await logAudit({
      user: user._id,
      userRole: user.role,
      action: 'USER_LOGIN',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        avatar: user.avatar,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'parent') {
      profile = await ParentProfile.findOne({ user: user._id });
    } else if (user.role === 'tutor') {
      profile = await TutorProfile.findOne({ user: user._id });
    } else if (user.role === 'center') {
      profile = await TuitionCenter.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        avatar: user.avatar,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, ...profileFields } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    await user.save();

    let updatedProfile = null;
    if (user.role === 'parent') {
      updatedProfile = await ParentProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    } else if (user.role === 'tutor') {
      updatedProfile = await TutorProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    } else if (user.role === 'center') {
      updatedProfile = await TuitionCenter.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        avatar: user.avatar,
        profile: updatedProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      user: user._id,
      userRole: user.role,
      action: 'PASSWORD_CHANGED',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerParent,
  registerTutor,
  registerCenter,
  login,
  getMe,
  updateProfile,
  changePassword,
};
