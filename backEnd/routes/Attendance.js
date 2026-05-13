const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { getAttendance, markAttendance } = require('../controllers/Attendancecontroller');

// GET /api/attendance/:eventId
router.get('/:eventId', isAuthenticated, isAdmin, getAttendance);

// POST /api/attendance
router.post('/', isAuthenticated, isAdmin, markAttendance);

module.exports = router;
