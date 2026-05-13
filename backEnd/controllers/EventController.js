const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET /api/events — all published (students) or all (admin)
const getEvents = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { status: 'published' };
    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events — admin only
const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.user._id };
    if (req.file) eventData.image = req.file.path;
    const event = await Event.create(eventData);
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/events/:id — admin only
const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/events/:id — admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    // Remove all registrations for this event
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/stats — admin dashboard stats
const getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'published', date: { $gte: new Date() } });
    const totalRegistrations = await Registration.countDocuments();
    const attendedCount = await Registration.countDocuments({ status: 'attended' });
    const attendanceRate = totalRegistrations > 0
      ? Math.round((attendedCount / totalRegistrations) * 100)
      : 0;

    // Recent events with registration counts
    const recentEvents = await Event.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalEvents, activeEvents, totalRegistrations, attendanceRate, recentEvents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getStats };