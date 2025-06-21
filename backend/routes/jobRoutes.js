const express = require('express');
const router = express.Router();
const { validateJob, validateId } = require('../middleware/validator');
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobStats
} = require('../controllers/jobController');

// GET /api/jobs/stats - Get job statistics
router.get('/stats', getJobStats);

// GET /api/jobs - Get all jobs with filtering and pagination
router.get('/', getAllJobs);

// GET /api/jobs/:id - Get single job by ID
router.get('/:id', validateId, getJobById);

// POST /api/jobs - Create new job
router.post('/', validateJob, createJob);

// PUT /api/jobs/:id - Update job
router.put('/:id', validateId, validateJob, updateJob);

// DELETE /api/jobs/:id - Delete job (soft delete)
router.delete('/:id', validateId, deleteJob);

module.exports = router;