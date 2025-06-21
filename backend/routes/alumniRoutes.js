const express = require('express');
const router = express.Router();
const { validateAlumni, validateAlumniUpdate, validateId } = require('../middleware/validator');
const {
    getAllAlumni,
    getAlumniById,
    createAlumni,
    updateAlumni,
    deleteAlumni,
    getAlumniStats
} = require('../controllers/alumniController');

// GET /api/alumni/stats - Get alumni statistics
router.get('/stats', getAlumniStats);

// GET /api/alumni - Get all alumni with filtering and pagination
router.get('/', getAllAlumni);

// GET /api/alumni/:id - Get single alumni by ID
router.get('/:id', validateId, getAlumniById);

// POST /api/alumni - Create new alumni
router.post('/', validateAlumni, createAlumni);

// PUT /api/alumni/:id - Update alumni
router.put('/:id', validateId, validateAlumniUpdate, updateAlumni);

// DELETE /api/alumni/:id - Delete alumni (soft delete)
router.delete('/:id', validateId, deleteAlumni);

module.exports = router;