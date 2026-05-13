const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware.js');
const { upload } = require('../config/cloudinary.js');
const {
  getEvents, getEventById, createEvent, updateEvent, deleteEvent, getStats
} = require('../controllers/EventController.js');

// GET /api/events/stats  — admin
router.get('/stats', isAuthenticated, isAdmin, getStats);

// GET /api/events
router.get('/', isAuthenticated, getEvents);

// GET /api/events/:id
router.get('/:id', isAuthenticated, getEventById);

// POST /api/events — admin
router.post('/', isAuthenticated, isAdmin, upload.single('image'), createEvent);

// PUT /api/events/:id — admin
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'), updateEvent);

// DELETE /api/events/:id — admin
router.delete('/:id', isAuthenticated, isAdmin, deleteEvent);

module.exports = router;
