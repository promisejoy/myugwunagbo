const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['NGO', 'Foundation', 'CBO', 'CSO'],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  yearFounded: {
    type: Number,
    required: true,
  },
  focusArea: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  projects: {
    type: String,
    default: '',
  },
  logo: {
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

module.exports = mongoose.model('NGO', NGOSchema);