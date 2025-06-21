// test.js (create this in your backend folder)
try {
    const validator = require('./middleware/validation.js');
    console.log('Validator found!', Object.keys(validator));
} catch (error) {
    console.log('Validator not found:', error.message);
}