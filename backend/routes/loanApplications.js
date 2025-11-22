const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const auth = require('../middleware/auth');

// @route   POST /api/loan-applications
// @desc    Submit a new loan application
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      loanType,
      propertyFinalized,
      propertyValue,
      profession,
      annualIncome,
      loanAmount,
      phoneNumber
    } = req.body;

    // Validate required fields
    if (!loanType || propertyFinalized === undefined || !propertyValue || 
        !profession || !annualIncome || !loanAmount || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new loan application
    const loanApplication = new LoanApplication({
      loanType,
      propertyFinalized,
      propertyValue,
      profession,
      annualIncome,
      loanAmount,
      phoneNumber
    });

    await loanApplication.save();

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: {
        id: loanApplication._id,
        applicationNumber: loanApplication._id.toString().slice(-8).toUpperCase()
      }
    });

  } catch (error) {
    console.error('Error submitting loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/loan-applications
// @desc    Get all loan applications (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get filter parameters
    const { status, loanType, dateFrom, dateTo } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (loanType) filter.loanType = loanType;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const applications = await LoanApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoanApplication.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching loan applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/loan-applications/:id
// @desc    Get single loan application (Admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   PUT /api/loan-applications/:id
// @desc    Update loan application data (Admin only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      loanType,
      propertyFinalized,
      propertyValue,
      profession,
      annualIncome,
      loanAmount,
      phoneNumber
    } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (loanType !== undefined) updateData.loanType = loanType;
    if (propertyFinalized !== undefined) updateData.propertyFinalized = propertyFinalized;
    if (propertyValue !== undefined) updateData.propertyValue = propertyValue;
    if (profession !== undefined) updateData.profession = profession;
    if (annualIncome !== undefined) updateData.annualIncome = annualIncome;
    if (loanAmount !== undefined) updateData.loanAmount = loanAmount;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    
    updateData.updatedAt = new Date();

    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   PUT /api/loan-applications/:id/status
// @desc    Update loan application status (Admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating loan application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/loan-applications/stats/dashboard
// @desc    Get dashboard statistics (Admin only)
// @access  Private
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const totalApplications = await LoanApplication.countDocuments();
    const pendingApplications = await LoanApplication.countDocuments({ status: 'pending' });
    const approvedApplications = await LoanApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await LoanApplication.countDocuments({ status: 'rejected' });

    // Applications by loan type
    const loanTypeStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$loanType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Applications by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await LoanApplication.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalApplications,
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications
        },
        loanTypes: loanTypeStats,
        monthly: monthlyStats
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

module.exports = router;
