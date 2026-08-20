const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  facebook: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('Leader', LeaderSchema);