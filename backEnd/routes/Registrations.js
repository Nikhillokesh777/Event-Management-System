const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const {
  registerForEvent, getMyRegistrations, getEventRegistrations, cancelRegistration
} = require('../controllers/Registrationcontroller');
 
// POST /api/registrations
router.post('/', isAuthenticated, registerForEvent);
 
// GET /api/registrations/my
router.get('/my', isAuthenticated, getMyRegistrations);
 
// GET /api/registrations/event/:eventId — admin
router.get('/event/:eventId', isAuthenticated, isAdmin, getEventRegistrations);
 
// DELETE /api/registrations/:id
router.delete('/:id', isAuthenticated, cancelRegistration);
 
module.exports = router;
 
