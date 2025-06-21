const mongoose = require('mongoose');

const validateAlumni = (req, res, next) => {
    const { name, email, graduationYear, degree } = req.body;
    const errors = [];

    // Required field validation
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (name.length < 2 || name.length > 100) {
        errors.push('Name must be between 2 and 100 characters');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    if (!graduationYear) {
        errors.push('Graduation year is required');
    } else {
        // Graduation year validation (2000 to current year + 5)
        const currentYear = new Date().getFullYear();
        if (graduationYear < 2000 || graduationYear > currentYear + 5) {
            errors.push(`Graduation year must be between 2000 and ${currentYear + 5}`);
        }
    }

    if (!degree || degree.trim() === '') {
        errors.push('Degree is required');
    }

    // Optional field validations
    if (req.body.currentPosition && req.body.currentPosition.length > 200) {
        errors.push('Current position cannot exceed 200 characters');
    }

    if (req.body.company && req.body.company.length > 100) {
        errors.push('Company name cannot exceed 100 characters');
    }

    if (req.body.location && req.body.location.length > 100) {
        errors.push('Location cannot exceed 100 characters');
    }

    if (req.body.bio && req.body.bio.length > 500) {
        errors.push('Bio cannot exceed 500 characters');
    }

    // Social links validation
    if (req.body.socialLinks) {
        const { linkedin, twitter, github } = req.body.socialLinks;
        
        if (linkedin && !linkedin.match(/^https?:\/\/(www\.)?linkedin\.com\/.*/)) {
            errors.push('Invalid LinkedIn URL format');
        }
        
        if (twitter && !twitter.match(/^https?:\/\/(www\.)?twitter\.com\/.*/)) {
            errors.push('Invalid Twitter URL format');
        }
        
        if (github && !github.match(/^https?:\/\/(www\.)?github\.com\/.*/)) {
            errors.push('Invalid GitHub URL format');
        }
    }

    // If there are validation errors, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // If validation passes, continue to next middleware
    next();
};

const validateAlumniUpdate = (req, res, next) => {
    const { email, graduationYear, name } = req.body;
    const errors = [];

    // Name validation (if provided)
    if (name !== undefined) {
        if (!name || name.trim() === '') {
            errors.push('Name cannot be empty');
        } else if (name.length < 2 || name.length > 100) {
            errors.push('Name must be between 2 and 100 characters');
        }
    }

    // Email format validation (if provided)
    if (email && email.trim() !== '') {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    // Graduation year validation (if provided)
    if (graduationYear !== undefined) {
        const currentYear = new Date().getFullYear();
        if (graduationYear < 2000 || graduationYear > currentYear + 5) {
            errors.push(`Graduation year must be between 2000 and ${currentYear + 5}`);
        }
    }

    // Optional field validations
    if (req.body.currentPosition && req.body.currentPosition.length > 200) {
        errors.push('Current position cannot exceed 200 characters');
    }

    if (req.body.company && req.body.company.length > 100) {
        errors.push('Company name cannot exceed 100 characters');
    }

    if (req.body.location && req.body.location.length > 100) {
        errors.push('Location cannot exceed 100 characters');
    }

    if (req.body.bio && req.body.bio.length > 500) {
        errors.push('Bio cannot exceed 500 characters');
    }

    // Social links validation
    if (req.body.socialLinks) {
        const { linkedin, twitter, github } = req.body.socialLinks;
        
        if (linkedin && !linkedin.match(/^https?:\/\/(www\.)?linkedin\.com\/.*/)) {
            errors.push('Invalid LinkedIn URL format');
        }
        
        if (twitter && !twitter.match(/^https?:\/\/(www\.)?twitter\.com\/.*/)) {
            errors.push('Invalid Twitter URL format');
        }
        
        if (github && !github.match(/^https?:\/\/(www\.)?github\.com\/.*/)) {
            errors.push('Invalid GitHub URL format');
        }
    }

    // If there are validation errors, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // If validation passes, continue to next middleware
    next();
};

const validateId = (req, res, next) => {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format. Must be a valid MongoDB ObjectId.'
        });
    }
    
    next();
};

const validateJob = (req, res, next) => {
    const { 
        title, 
        company, 
        description, 
        location, 
        jobType, 
        experienceLevel, 
        category, 
        postedBy, 
        applicationEmail 
    } = req.body;
    const errors = [];

    // Required field validation
    if (!title || title.trim() === '') {
        errors.push('Job title is required');
    } else if (title.length > 200) {
        errors.push('Job title cannot exceed 200 characters');
    }

    if (!company || company.trim() === '') {
        errors.push('Company name is required');
    } else if (company.length > 100) {
        errors.push('Company name cannot exceed 100 characters');
    }

    if (!description || description.trim() === '') {
        errors.push('Job description is required');
    } else if (description.length > 2000) {
        errors.push('Job description cannot exceed 2000 characters');
    }

    if (!location || location.trim() === '') {
        errors.push('Job location is required');
    } else if (location.length > 100) {
        errors.push('Location cannot exceed 100 characters');
    }

    if (!jobType) {
        errors.push('Job type is required');
    } else {
        const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
        if (!validJobTypes.includes(jobType)) {
            errors.push('Invalid job type');
        }
    }

    if (!experienceLevel) {
        errors.push('Experience level is required');
    } else {
        const validExperienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
        if (!validExperienceLevels.includes(experienceLevel)) {
            errors.push('Invalid experience level');
        }
    }

    if (!category) {
        errors.push('Job category is required');
    } else {
        const validCategories = [
            'Technology', 'Engineering', 'Business', 'Marketing', 'Finance',
            'Healthcare', 'Education', 'Design', 'Sales', 'Other'
        ];
        if (!validCategories.includes(category)) {
            errors.push('Invalid job category');
        }
    }

    if (!postedBy) {
        errors.push('Posted by alumni ID is required');
    } else if (!mongoose.Types.ObjectId.isValid(postedBy)) {
        errors.push('Invalid alumni ID format for postedBy field');
    }

    if (!applicationEmail || applicationEmail.trim() === '') {
        errors.push('Application email is required');
    } else {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(applicationEmail)) {
            errors.push('Invalid application email format');
        }
    }

    // Optional validations
    if (req.body.applicationUrl && !req.body.applicationUrl.match(/^https?:\/\/.*/)) {
        errors.push('Invalid application URL format');
    }

    if (req.body.applicationDeadline) {
        const deadline = new Date(req.body.applicationDeadline);
        if (deadline <= new Date()) {
            errors.push('Application deadline must be in the future');
        }
    }

    // Salary validation
    if (req.body.salary) {
        const { min, max } = req.body.salary;
        if (min !== undefined && (isNaN(min) || min < 0)) {
            errors.push('Minimum salary must be a valid positive number');
        }
        if (max !== undefined && (isNaN(max) || max < 0)) {
            errors.push('Maximum salary must be a valid positive number');
        }
        if (min !== undefined && max !== undefined && min > max) {
            errors.push('Minimum salary cannot be greater than maximum salary');
        }
    }

    // If there are validation errors, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // If validation passes, continue to next middleware
    next();
};

module.exports = {
    validateAlumni,
    validateAlumniUpdate,
    validateId,
    validateJob
};