const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [200, 'Job title cannot exceed 200 characters']
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true,
        maxlength: [2000, 'Job description cannot exceed 2000 characters']
    },
    requirements: [{
        type: String,
        trim: true,
        maxlength: [200, 'Each requirement cannot exceed 200 characters']
    }],
    salary: {
        min: {
            type: Number,
            min: [0, 'Minimum salary cannot be negative']
        },
        max: {
            type: Number,
            min: [0, 'Maximum salary cannot be negative']
        },
        currency: {
            type: String,
            default: 'PKR',
            enum: ['PKR', 'USD', 'EUR', 'GBP']
        }
    },
    jobType: {
        type: String,
        required: [true, 'Job type is required'],
        enum: {
            values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
            message: 'Please select a valid job type'
        }
    },
    experienceLevel: {
        type: String,
        required: [true, 'Experience level is required'],
        enum: {
            values: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
            message: 'Please select a valid experience level'
        }
    },
    category: {
        type: String,
        required: [true, 'Job category is required'],
        enum: {
            values: [
                'Technology',
                'Engineering',
                'Business',
                'Marketing',
                'Finance',
                'Healthcare',
                'Education',
                'Design',
                'Sales',
                'Other'
            ],
            message: 'Please select a valid job category'
        }
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: [true, 'Posted by alumni ID is required']
    },
    applicationDeadline: {
        type: Date,
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Application deadline must be in the future'
        }
    },
    applicationEmail: {
        type: String,
        required: [true, 'Application email is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    applicationUrl: {
        type: String,
        match: [/^https?:\/\/.*/, 'Please enter a valid URL']
    },
    skills: [{
        type: String,
        trim: true
    }],
    benefits: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    applications: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for days since posted
JobSchema.virtual('daysSincePosted').get(function() {
    const diffTime = Math.abs(new Date() - this.createdAt);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for application deadline status
JobSchema.virtual('isDeadlinePassed').get(function() {
    if (!this.applicationDeadline) return false;
    return new Date() > this.applicationDeadline;
});

// Index for efficient searching
JobSchema.index({ title: 'text', company: 'text', description: 'text' });
JobSchema.index({ category: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ experienceLevel: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ postedBy: 1 });

// Static methods
JobSchema.statics.findActiveJobs = function() {
    return this.find({ 
        isActive: true,
        $or: [
            { applicationDeadline: { $exists: false } },
            { applicationDeadline: { $gt: new Date() } }
        ]
    }).populate('postedBy', 'name company');
};

JobSchema.statics.findByCategory = function(category) {
    return this.find({ category: category, isActive: true })
        .populate('postedBy', 'name company');
};

JobSchema.statics.getJobStatistics = function() {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgViews: { $avg: '$views' },
                totalApplications: { $sum: '$applications' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

module.exports = mongoose.model('Job', JobSchema);