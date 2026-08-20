const mongoose = require('mongoose');

const ServiceApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['birth-certificate', 'marriage-certificate', 'local-origin', 'business-permit', 'building-approval', 'tax-clearance', 'market-permit', 'other'],
  },
  wardNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  purpose: {
    type: String,
    default: '',
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  documents: [{
    name: String,
    url: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'payment_pending', 'in_review', 'approved', 'rejected'],
    default: 'pending',
  },
  payment: {
    amount: Number,
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    paidAt: Date,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
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

// Generate application ID before saving
ServiceApplicationSchema.pre('save', function(next) {
  if (!this.applicationId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.applicationId = `UGW-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('ServiceApplication', ServiceApplicationSchema);