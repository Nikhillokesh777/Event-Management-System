const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['college', 'external'],
    default: 'college'
  },
  isFree: {
    type: Boolean,
    default: true
  },
  fee: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required']
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'published'
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);