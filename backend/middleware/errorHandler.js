const errorHandler = (err, req, res, next) => {
    console.error('Error Details:');
    console.error('Time:', new Date().toISOString());
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('Error:', err.stack);
    
    // Default error response
    let error = {
        success: false,
        error: 'Internal Server Error'
    };
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
        error.error = 'Validation Error';
        error.details = err.message;
        return res.status(400).json(error);
    }
    
    if (err.name === 'CastError') {
        error.error = 'Invalid ID format';
        return res.status(400).json(error);
    }
    
    // Send generic error response
    res.status(500).json(error);
};

module.exports = errorHandler;