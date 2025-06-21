const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');



// Import database connection
const connectDB = require('./config/database');

// Import routes
const alumniRoutes = require('./routes/alumniRoutes');
const jobRoutes = require('./routes/jobRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // React dev servers
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger); // Custom request logger

// Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Namal Nexus API is running successfully',
        timestamp: new Date().toISOString(),
        database: 'Connected to MongoDB',
        endpoints: {
            alumni: '/api/alumni',
            jobs: '/api/jobs',
            events: '/api/events'
        },
        version: '2.0.0'
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Namal Nexus Alumni Portal API',
        version: '2.0.0',
        database: 'MongoDB with Mongoose',
        documentation: 'Check /api/health for available endpoints',
        features: [
            'RESTful API Design',
            'MongoDB Integration',
            'Mongoose ODM',
            'Data Validation',
            'Error Handling',
            'Request Logging',
            'Pagination Support',
            'Advanced Filtering',
            'Aggregation Pipelines'
        ]
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `The requested resource ${req.originalUrl} was not found on this server`,
        availableEndpoints: [
            'GET /api/health',
            'GET /api/alumni',
            'GET /api/jobs',
            'GET /api/events'
        ]
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 Namal Nexus API Server Started Successfully!');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database: MongoDB with Mongoose ODM`);
    console.log('\n📋 Available API Endpoints:');
    console.log(`   Alumni: http://localhost:${PORT}/api/alumni`);
    console.log(`   Jobs: http://localhost:${PORT}/api/jobs`);
    console.log(`   Events: http://localhost:${PORT}/api/events`);
    console.log('\n🔧 Additional Features:');
    console.log('   ✅ RESTful API Design');
    console.log('   ✅ MongoDB Integration');
    console.log('   ✅ Mongoose ODM');
    console.log('   ✅ Data Validation');
    console.log('   ✅ Error Handling');
    console.log('   ✅ Request Logging');
    console.log('   ✅ Pagination Support');
    console.log('   ✅ Advanced Filtering');
    console.log('   ✅ Aggregation Pipelines');
    console.log('\n🧪 Test Commands:');
    console.log('   npm run mongo-demo    - Run MongoDB native client demo');
    console.log('   npm run aggregate-demo - Run aggregation pipeline demo');
    console.log('\n🎯 Ready for testing with Postman or any HTTP client!\n');
});

module.exports = app;