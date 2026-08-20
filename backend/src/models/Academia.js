const mongoose = require('mongoose');

const AcademiaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  village: {
    type: String,
    required: true,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Academia', AcademiaSchema);