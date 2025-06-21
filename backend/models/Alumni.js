const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    graduationYear: {
        type: Number,
        required: [true, 'Graduation year is required'],
        min: [2000, 'Graduation year must be 2000 or later'],
        max: [new Date().getFullYear() + 5, 'Graduation year cannot be more than 5 years in the future']
    },
    degree: {
        type: String,
        required: [true, 'Degree is required'],
        trim: true,
        enum: {
            values: [
                'Computer Science',
                'Business Administration',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Civil Engineering',
                'Economics',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'English Literature',
                'Other'
            ],
            message: 'Please select a valid degree'
        }
    },
    currentPosition: {
        type: String,
        trim: true,
        maxlength: [200, 'Current position cannot exceed 200 characters']
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    profileImage: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
        type: String,
        trim: true
    }],
    socialLinks: {
        linkedin: {
            type: String,
            match: [/^https?:\/\/(www\.)?linkedin\.com\/.*/, 'Please enter a valid LinkedIn URL']
        },
        twitter: {
            type: String,
            match: [/^https?:\/\/(www\.)?twitter\.com\/.*/, 'Please enter a valid Twitter URL']
        },
        github: {
            type: String,
            match: [/^https?:\/\/(www\.)?github\.com\/.*/, 'Please enter a valid GitHub URL']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for years since graduation
AlumniSchema.virtual('yearsSinceGraduation').get(function() {
    return new Date().getFullYear() - this.graduationYear;
});

// Virtual for full profile completion percentage
AlumniSchema.virtual('profileCompletion').get(function() {
    let completed = 0;
    const fields = ['name', 'email', 'graduationYear', 'degree', 'currentPosition', 'company', 'location', 'bio'];
    
    fields.forEach(field => {
        if (this[field] && this[field].toString().trim() !== '') {
            completed++;
        }
    });
    
    return Math.round((completed / fields.length) * 100);
});

// Index for efficient searching
AlumniSchema.index({ name: 'text', company: 'text', currentPosition: 'text' });
AlumniSchema.index({ graduationYear: 1 });
AlumniSchema.index({ degree: 1 });
AlumniSchema.index({ email: 1 });

// Pre-save middleware
AlumniSchema.pre('save', function(next) {
    // Capitalize first letter of name
    if (this.name) {
        this.name = this.name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    next();
});

// Static methods
AlumniSchema.statics.findByGraduationYear = function(year) {
    return this.find({ graduationYear: year, isActive: true });
};

AlumniSchema.statics.findByDegree = function(degree) {
    return this.find({ degree: degree, isActive: true });
};

AlumniSchema.statics.getStatistics = function() {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: null,
                totalAlumni: { $sum: 1 },
                avgGraduationYear: { $avg: '$graduationYear' },
                degreeCounts: {
                    $push: '$degree'
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Alumni', AlumniSchema);