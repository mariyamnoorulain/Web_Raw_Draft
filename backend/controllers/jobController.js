const Job = require('../models/Job');
const Alumni = require('../models/Alumni');

// GET /api/jobs - Get all jobs with filtering and pagination
const getAllJobs = async (req, res) => {
    try {
        const { 
            category,
            jobType,
            experienceLevel,
            location,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (jobType) {
            filter.jobType = jobType;
        }
        
        if (experienceLevel) {
            filter.experienceLevel = experienceLevel;
        }
        
        if (location) {
            filter.location = new RegExp(location, 'i');
        }
        
        // Text search across multiple fields
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { company: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') }
            ];
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination and population
        const jobs = await Job.find(filter)
            .populate('postedBy', 'name email company currentPosition')
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .select('-__v');

        // Get total count for pagination
        const total = await Job.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            page: pageNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving jobs',
            error: error.message
        });
    }
};

// GET /api/jobs/:id - Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email company currentPosition profileImage')
            .select('-__v');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment view count
        await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error retrieving job',
            error: error.message
        });
    }
};

// POST /api/jobs - Create new job
const createJob = async (req, res) => {
    try {
        // Verify that the postedBy alumni exists
        if (req.body.postedBy) {
            const alumni = await Alumni.findById(req.body.postedBy);
            if (!alumni) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid alumni ID for postedBy field'
                });
            }
        }

        const job = new Job(req.body);
        const savedJob = await job.save();
        
        // Populate the postedBy field for response
        await savedJob.populate('postedBy', 'name email company');

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: savedJob
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
            message: 'Error creating job',
            error: error.message
        });
    }
};

// PUT /api/jobs/:id - Update job
const updateJob = async (req, res) => {
    try {
        // Verify that the postedBy alumni exists if being updated
        if (req.body.postedBy) {
            const alumni = await Alumni.findById(req.body.postedBy);
            if (!alumni) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid alumni ID for postedBy field'
                });
            }
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('postedBy', 'name email company').select('-__v');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: job
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
                message: 'Invalid job ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

// DELETE /api/jobs/:id - Delete job (soft delete)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

// GET /api/jobs/stats - Get job statistics
const getJobStats = async (req, res) => {
    try {
        const stats = await Job.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgViews: { $avg: '$views' },
                    totalApplications: { $sum: '$applications' },
                    avgMinSalary: { $avg: '$salary.min' },
                    avgMaxSalary: { $avg: '$salary.max' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Job type distribution
        const jobTypeStats = await Job.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$jobType',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Experience level distribution
        const experienceStats = await Job.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$experienceLevel',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Recent jobs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentJobsCount = await Job.countDocuments({
            isActive: true,
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                byCategory: stats,
                byJobType: jobTypeStats,
                byExperience: experienceStats,
                recentJobs: recentJobsCount,
                totalActiveJobs: await Job.countDocuments({ isActive: true })
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving job statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobStats
};