const Alumni = require('../models/Alumni');

// GET /api/alumni - Get all alumni with filtering and pagination
const getAllAlumni = async (req, res) => {
    try {
        const { 
            graduationYear, 
            degree, 
            location, 
            company,
            search,
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (graduationYear) {
            filter.graduationYear = parseInt(graduationYear);
        }
        
        if (degree) {
            filter.degree = new RegExp(degree, 'i');
        }
        
        if (location) {
            filter.location = new RegExp(location, 'i');
        }
        
        if (company) {
            filter.company = new RegExp(company, 'i');
        }
        
        // Text search across multiple fields
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { company: new RegExp(search, 'i') },
                { currentPosition: new RegExp(search, 'i') },
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

        // Execute query with pagination
        const alumni = await Alumni.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .select('-__v');

        // Get total count for pagination
        const total = await Alumni.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            count: alumni.length,
            total,
            page: pageNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            data: alumni
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving alumni',
            error: error.message
        });
    }
};

// GET /api/alumni/:id - Get alumni by ID
const getAlumniById = async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id).select('-__v');

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        res.status(200).json({
            success: true,
            data: alumni
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid alumni ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error retrieving alumni',
            error: error.message
        });
    }
};

// POST /api/alumni - Create new alumni
const createAlumni = async (req, res) => {
    try {
        const alumni = new Alumni(req.body);
        const savedAlumni = await alumni.save();

        res.status(201).json({
            success: true,
            message: 'Alumni created successfully',
            data: savedAlumni
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
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Alumni with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating alumni',
            error: error.message
        });
    }
};

// PUT /api/alumni/:id - Update alumni
const updateAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-__v');

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Alumni updated successfully',
            data: alumni
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
                message: 'Invalid alumni ID format'
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Alumni with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating alumni',
            error: error.message
        });
    }
};

// DELETE /api/alumni/:id - Delete alumni (soft delete)
const deleteAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Alumni deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid alumni ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting alumni',
            error: error.message
        });
    }
};

// GET /api/alumni/stats - Get alumni statistics
const getAlumniStats = async (req, res) => {
    try {
        const stats = await Alumni.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalAlumni: { $sum: 1 },
                    avgGraduationYear: { $avg: '$graduationYear' },
                    degreeCounts: {
                        $push: '$degree'
                    },
                    locationCounts: {
                        $push: '$location'
                    }
                }
            }
        ]);

        // Count degrees
        const degreeStats = await Alumni.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$degree',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Count by graduation year
        const yearStats = await Alumni.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$graduationYear',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats[0] || { totalAlumni: 0, avgGraduationYear: 0 },
                byDegree: degreeStats,
                byYear: yearStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving alumni statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllAlumni,
    getAlumniById,
    createAlumni,
    updateAlumni,
    deleteAlumni,
    getAlumniStats
};