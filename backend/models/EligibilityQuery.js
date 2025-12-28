const mongoose = require('mongoose');

const eligibilityQuerySchema = new mongoose.Schema({
  loanType: {
    type: String,
    required: true
  },
  loanAmount: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Allow any digits, will clean up on backend
        return v && v.length >= 10;
      },
      message: 'Phone number must be at least 10 digits'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'rejected'],
    default: 'pending'
  },
  applicationNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate application number before saving
eligibilityQuerySchema.pre('save', function(next) {
  this.updatedAt = new Date();

  if (!this.applicationNumber) {
    // Generate application number: EQ + timestamp + random
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.applicationNumber = `EQ${timestamp}${random}`;
  }

  next();
});

module.exports = mongoose.model('EligibilityQuery', eligibilityQuerySchema);
