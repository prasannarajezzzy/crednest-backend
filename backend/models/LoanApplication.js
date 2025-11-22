const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  loanType: {
    type: String,
    required: true,
    enum: ['new-home', 'balance-transfer', 'loan-against-property']
  },
  propertyFinalized: {
    type: Boolean,
    required: true
  },
  propertyValue: {
    type: String,
    required: true,
    enum: ['Under 1 Crore', '1 Crore to 2 Crore', '2 Crore to 3 Crore', 'Above 3 Crore']
  },
  profession: {
    type: String,
    required: true,
    enum: ['Salaried', 'Self Employed']
  },
  annualIncome: {
    type: String,
    required: true,
    enum: ['Above 50 L', '25L - 50L', '18L - 25L', '12L - 18L', '6L - 12L', 'Below 6L']
  },
  loanAmount: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
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

// Update the updatedAt field before saving
loanApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
