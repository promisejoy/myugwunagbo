const mongoose = require('mongoose');

const GovernorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: 'Executive Governor',
  },
  bio: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Governor', GovernorSchema);