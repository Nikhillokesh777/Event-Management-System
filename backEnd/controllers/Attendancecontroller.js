const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');

// GET /api/attendance/:eventId — admin: get attendance list for event
const getAttendance = async (req, res) => {
  try {
    // Get all registrations for event, then join with attendance
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email studentId department');

    const attendanceRecords = await Attendance.find({ event: req.params.eventId });
    const attendanceMap = {};
    attendanceRecords.forEach(r => { attendanceMap[r.student.toString()] = r; });

    const result = registrations.map(reg => ({
      registrationId: reg._id,
      registrationCode: reg.registrationId,
      student: reg.student,
      registeredAt: reg.createdAt,
      attendanceMarked: !!attendanceMap[reg.student._id.toString()],
      attendanceId: attendanceMap[reg.student._id.toString()]?._id || null,
    }));

    res.json({ attendance: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/attendance — admin marks attendance
const markAttendance = async (req, res) => {
  try {
    const { eventId, studentId, present } = req.body;

    if (present) {
      const record = await Attendance.findOneAndUpdate(
        { event: eventId, student: studentId },
        { present: true, markedAt: new Date(), markedBy: req.user._id },
        { upsert: true, new: true }
      );
      // Update registration status to attended
      await Registration.findOneAndUpdate(
        { event: eventId, student: studentId },
        { status: 'attended' }
      );
      res.json({ message: 'Attendance marked', record });
    } else {
      await Attendance.findOneAndDelete({ event: eventId, student: studentId });
      await Registration.findOneAndUpdate(
        { event: eventId, student: studentId },
        { status: 'registered' }
      );
      res.json({ message: 'Attendance unmarked' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendance, markAttendance };