const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const STUDENT_EMAIL_DOMAIN = '@paruluniversity.ac.in';
const normalizeEmail = (email = '') => email.trim().toLowerCase();
const isStudentEmail = (email = '') => normalizeEmail(email).endsWith(STUDENT_EMAIL_DOMAIN);
const isValidStudentId = (studentId = '') => /^\d{13,}$/.test(String(studentId).trim());

const registerStudent = async (req, res) => {
  try {
    const { name, password, studentId, department, phone } = req.body;
    const email = normalizeEmail(req.body.email);

    if (req.body.role && req.body.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created through registration' });
    }

    if (!isStudentEmail(email)) {
      return res.status(400).json({
        message: 'Student registration requires an email ending with @paruluniversity.ac.in'
      });
    }

    if (!isValidStudentId(studentId)) {
      return res.status(400).json({
        message: 'Student ID must be at least 13 digits, for example 2303031240129'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      department,
      phone,
      role: 'student'
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login after register failed' });
      return res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    req.body.email = email;

    const existingUser = await User.findOne({ email }).select('role');
    if (!existingUser) {
      return res.status(401).json({ message: 'No account found with this email' });
    }

    if (existingUser.role !== 'admin' && !isStudentEmail(email)) {
      return res.status(400).json({
        message: 'Use your @paruluniversity.ac.in email for student login'
      });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({
          message: 'Login successful',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId,
            department: user.department
          }
        });
      });
    })(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
};

const getMe = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      studentId: req.user.studentId,
      department: req.user.department,
      phone: req.user.phone
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });

    const { name, phone, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const otpStore = {};

const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    console.log(`\nOTP for ${email}: ${otp} (expires in 10 min)\n`);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = (req.body.otp || '').trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new one.' });
    }
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = (req.body.otp || '').trim();
    const password = req.body.password || '';

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'New password is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: 'No OTP found. Please restart the forgot password process.' });
    }
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please restart the process.' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];

    res.json({ message: 'Password reset successfully. Please log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerStudent,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword
};
