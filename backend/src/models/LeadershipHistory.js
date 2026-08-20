const mongoose = require('mongoose');

const LeadershipHistorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  village: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  period: {
    type: String,
    required: true,
    trim: true,
  },
  achievements: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: null,
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

module.exports = mongoose.model('LeadershipHistory', LeadershipHistorySchema);