 const express = require('express');
const router  = express.Router();

const {
  registerStudent,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require('../controllers/authController');

// ─── Existing routes (unchanged) ────────────────────────────────────────────
router.post('/register', registerStudent);   // POST /api/auth/register
router.post('/login',    loginUser);         // POST /api/auth/login
router.post('/logout',   logoutUser);        // POST /api/auth/logout
router.get ('/me',       getMe);             // GET  /api/auth/me
router.put ('/profile',  updateProfile);     // PUT  /api/auth/profile

// ─── Forgot password flow (3 steps) ─────────────────────────────────────────
router.post('/forgot-password', forgotPassword);  // Step 1 — send OTP
router.post('/verify-otp',      verifyOtp);       // Step 2 — verify OTP
router.post('/reset-password',  resetPassword);   // Step 3 — set new password

module.exports = router;