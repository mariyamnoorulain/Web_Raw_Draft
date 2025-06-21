const express = require('express');
const router = express.Router();
const { validateId } = require('../middleware/validator');
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventStats
} = require('../controllers/eventController');

// Validation middleware for events
const validateEvent = (req, res, next) => {
    const { title, description, date, time, location, category, maxAttendees, organizer, organizerContact } = req.body;
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Event title is required');
    }

    if (!description || description.trim() === '') {
        errors.push('Event description is required');
    }

    if (!date) {
        errors.push('Event date is required');
    } else {
        const eventDate = new Date(date);
        if (eventDate <= new Date()) {
            errors.push('Event date must be in the future');
        }
    }

    if (!time || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        errors.push('Valid event time is required (HH:MM format)');
    }

    if (!location || location.trim() === '') {
        errors.push('Event location is required');
    }

    if (!category) {
        errors.push('Event category is required');
    }

    if (!maxAttendees || maxAttendees < 1) {
        errors.push('Maximum attendees must be at least 1');
    }

    if (!organizer || organizer.trim() === '') {
        errors.push('Event organizer is required');
    }

    if (!organizerContact || !organizerContact.email) {
        errors.push('Organizer contact email is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    next();
};

// GET /api/events/stats - Get event statistics
router.get('/stats', getEventStats);

// GET /api/events - Get all events with filtering and pagination
router.get('/', getAllEvents);

// GET /api/events/:id - Get single event by ID
router.get('/:id', validateId, getEventById);

// POST /api/events - Create new event
router.post('/', validateEvent, createEvent);

// PUT /api/events/:id - Update event
router.put('/:id', validateId, validateEvent, updateEvent);

// DELETE /api/events/:id - Delete event (soft delete)
router.delete('/:id', validateId, deleteEvent);

// POST /api/events/:id/register - Register for event
router.post('/:id/register', validateId, registerForEvent);

module.exports = router;