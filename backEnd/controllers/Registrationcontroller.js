const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/registrations — student registers for event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'published') return res.status(400).json({ message: 'Event is not available' });
    if (event.registeredCount >= event.capacity) return res.status(400).json({ message: 'Event is full' });

    // Check already registered
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      paymentStatus: event.isFree ? 'free' : 'pending',
    });

    // Increment registeredCount
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already registered for this event' });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/registrations/my — student's own registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/registrations/event/:eventId — admin: all students for an event
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email studentId department phone')
      .sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/registrations/:id — cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({ _id: req.params.id, student: req.user._id });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    await Registration.findByIdAndDelete(req.params.id);
    await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });

    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, getEventRegistrations, cancelRegistration };