const Event = require('../models/Event');

// GET /api/events - Get all events with filtering and pagination
const getAllEvents = async (req, res) => {
    try {
        const { 
            category,
            upcoming,
            featured,
            eventType,
            search,
            page = 1,
            limit = 10,
            sortBy = 'date',
            sortOrder = 'asc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (eventType) {
            filter.eventType = eventType;
        }
        
        if (featured === 'true') {
            filter.isFeatured = true;
        }
        
        if (upcoming === 'true') {
            filter.date = { $gt: new Date() };
        }
        
        // Text search across multiple fields
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') },
                { organizer: new RegExp(search, 'i') }
            ];
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const events = await Event.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .select('-__v -attendees');

        // Get total count for pagination
        const total = await Event.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            count: events.length,
            total,
            page: pageNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving events',
            error: error.message
        });
    }
};

// GET /api/events/:id - Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('attendees.alumni', 'name email profileImage')
            .select('-__v');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error retrieving event',
            error: error.message
        });
    }
};

// POST /api/events - Create new event
const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        const savedEvent = await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: savedEvent
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

// PUT /api/events/:id - Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-__v');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};

// DELETE /api/events/:id - Delete event (soft delete)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
};

// POST /api/events/:id/register - Register for event
const registerForEvent = async (req, res) => {
    try {
        const { alumniId } = req.body;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if registration is open
        if (!event.isRegistrationOpen) {
            return res.status(400).json({
                success: false,
                message: 'Registration is closed for this event'
            });
        }

        // Check if already registered
        const alreadyRegistered = event.attendees.some(
            attendee => attendee.alumni.toString() === alumniId
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        // Add attendee
        event.attendees.push({
            alumni: alumniId,
            status: 'registered'
        });

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered for event',
            data: {
                eventId: event._id,
                currentAttendees: event.currentAttendees,
                availableSpots: event.availableSpots
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering for event',
            error: error.message
        });
    }
};

// GET /api/events/stats - Get event statistics
const getEventStats = async (req, res) => {
    try {
        const stats = await Event.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgAttendees: { $avg: '$currentAttendees' },
                    totalCapacity: { $sum: '$maxAttendees' },
                    totalAttendees: { $sum: '$currentAttendees' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Upcoming events count
        const upcomingCount = await Event.countDocuments({
            isActive: true,
            date: { $gt: new Date() }
        });

        // Featured events count
        const featuredCount = await Event.countDocuments({
            isActive: true,
            isFeatured: true,
            date: { $gt: new Date() }
        });

        res.status(200).json({
            success: true,
            data: {
                byCategory: stats,
                upcomingEvents: upcomingCount,
                featuredEvents: featuredCount,
                totalActiveEvents: await Event.countDocuments({ isActive: true })
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving event statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventStats
};