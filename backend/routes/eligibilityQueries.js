const express = require('express');
const router = express.Router();
const EligibilityQuery = require('../models/EligibilityQuery');
const auth = require('../middleware/auth');

// POST - Submit new eligibility query
router.post('/', async (req, res) => {
  try {
    const { loanType, loanAmount, fullName, phoneNumber } = req.body;

    // Clean phone number - remove spaces, dashes, and country code
    let cleanedPhone = phoneNumber.replace(/[\s\-\+]/g, '');

    // If it starts with 91, remove it (Indian country code)
    if (cleanedPhone.startsWith('91') && cleanedPhone.length > 10) {
      cleanedPhone = cleanedPhone.substring(2);
    }

    // Take only the last 10 digits
    cleanedPhone = cleanedPhone.slice(-10);

    const eligibilityQuery = new EligibilityQuery({
      loanType,
      loanAmount,
      fullName: fullName || 'Not Provided',
      phoneNumber: cleanedPhone
    });

    await eligibilityQuery.save();

    res.status(201).json({
      success: true,
      message: 'Eligibility query submitted successfully',
      data: {
        id: eligibilityQuery._id,
        applicationNumber: eligibilityQuery.applicationNumber
      }
    });
  } catch (error) {
    console.error('Error submitting eligibility query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit eligibility query',
      error: error.message
    });
  }
});

// GET - Get all eligibility queries (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queries = await EligibilityQuery.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await EligibilityQuery.countDocuments();

    res.json({
      success: true,
      data: {
        queries,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQueries: total
      }
    });
  } catch (error) {
    console.error('Error fetching eligibility queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligibility queries',
      error: error.message
    });
  }
});

module.exports = router;
