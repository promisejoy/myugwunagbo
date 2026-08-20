const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['image', 'video'],
  },
  file_url: {
    type: String,
    required: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  file_size: {
    type: Number,
  },
  mime_type: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', GallerySchema);