const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Use MongoDB Atlas URI if available, otherwise use local URI
        const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port: ${conn.connection.port}`);
        
        return conn;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('authentication failed')) {
            console.error('   Check your MongoDB username and password');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('   Check your internet connection and MongoDB URI');
        } else if (error.message.includes('timeout')) {
            console.error('   Connection timeout - check your network or MongoDB service');
        }
        
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = connectDB;