// models/Alumni.js
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  batch: Number,
  skills: [String],
  employed: Boolean
});

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;