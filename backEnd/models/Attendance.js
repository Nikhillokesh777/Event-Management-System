const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  present: {
    type: Boolean,
    default: false
  },
  markedAt: {
    type: Date
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// One attendance record per student per event
attendanceSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);