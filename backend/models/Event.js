const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Event title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [2000, 'Event description cannot exceed 2000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Event time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: {
            values: ['networking', 'career', 'social', 'educational', 'sports', 'cultural', 'other'],
            message: 'Please select a valid event category'
        }
    },
    maxAttendees: {
        type: Number,
        required: [true, 'Maximum attendees is required'],
        min: [1, 'Maximum attendees must be at least 1'],
        max: [10000, 'Maximum attendees cannot exceed 10,000']
    },
    currentAttendees: {
        type: Number,
        default: 0,
        min: [0, 'Current attendees cannot be negative']
    },
    attendees: [{
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumni'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'attended', 'cancelled'],
            default: 'registered'
        }
    }],
    organizer: {
        type: String,
        required: [true, 'Event organizer is required'],
        trim: true,
        maxlength: [100, 'Organizer name cannot exceed 100 characters']
    },
    organizerContact: {
        email: {
            type: String,
            required: [true, 'Organizer email is required'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        }
    },
    registrationDeadline: {
        type: Date,
        validate: {
            validator: function(date) {
                return !date || date < this.date;
            },
            message: 'Registration deadline must be before event date'
        }
    },
    eventImage: {
        type: String,
        default: 'https://via.placeholder.com/400x200'
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    eventType: {
        type: String,
        enum: ['in-person', 'virtual', 'hybrid'],
        default: 'in-person'
    },
    virtualLink: {
        type: String,
        validate: {
            validator: function(link) {
                return !link || /^https?:\/\/.*/.test(link);
            },
            message: 'Please enter a valid URL for virtual link'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for available spots
EventSchema.virtual('availableSpots').get(function() {
    return this.maxAttendees - this.currentAttendees;
});

// Virtual for registration status
EventSchema.virtual('isRegistrationOpen').get(function() {
    const now = new Date();
    const registrationDeadline = this.registrationDeadline || this.date;
    return now < registrationDeadline && this.currentAttendees < this.maxAttendees;
});

// Virtual for event status
EventSchema.virtual('eventStatus').get(function() {
    const now = new Date();
    if (now > this.date) return 'completed';
    if (now > (this.registrationDeadline || this.date)) return 'registration-closed';
    if (this.currentAttendees >= this.maxAttendees) return 'full';
    return 'open';
});

// Index for efficient searching
EventSchema.index({ title: 'text', description: 'text' });
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isActive: 1 });
EventSchema.index({ isFeatured: 1 });

// Pre-save middleware to update currentAttendees
EventSchema.pre('save', function(next) {
    if (this.attendees) {
        this.currentAttendees = this.attendees.filter(
            attendee => attendee.status === 'registered' || attendee.status === 'attended'
        ).length;
    }
    next();
});

// Static methods
EventSchema.statics.findUpcomingEvents = function() {
    return this.find({ 
        date: { $gt: new Date() },
        isActive: true 
    }).sort({ date: 1 });
};

EventSchema.statics.findByCategory = function(category) {
    return this.find({ 
        category: category,
        isActive: true,
        date: { $gt: new Date() }
    }).sort({ date: 1 });
};

EventSchema.statics.getFeaturedEvents = function() {
    return this.find({ 
        isFeatured: true,
        isActive: true,
        date: { $gt: new Date() }
    }).sort({ date: 1 }).limit(5);
};

module.exports = mongoose.model('Event', EventSchema);