const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/ContactQuery');
const auth = require('../middleware/auth');

// @route   POST /api/contact-queries
// @desc    Submit a new contact query
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new contact query
    const contactQuery = new ContactQuery({
      name,
      email,
      phone,
      message
    });

    await contactQuery.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: {
        id: contactQuery._id
      }
    });

  } catch (error) {
    console.error('Error submitting contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/contact-queries
// @desc    Get all contact queries (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get filter parameters
    const { status, dateFrom, dateTo, search } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const queries = await ContactQuery.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactQuery.countDocuments(filter);

    res.json({
      success: true,
      data: {
        queries,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contact queries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/contact-queries/:id
// @desc    Get single contact query (Admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const query = await ContactQuery.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }

    res.json({
      success: true,
      data: query
    });

  } catch (error) {
    console.error('Error fetching contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   PUT /api/contact-queries/:id/status
// @desc    Update contact query status (Admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const query = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: query
    });

  } catch (error) {
    console.error('Error updating contact query status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/contact-queries/stats/dashboard
// @desc    Get contact queries statistics (Admin only)
// @access  Private
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const totalQueries = await ContactQuery.countDocuments();
    const newQueries = await ContactQuery.countDocuments({ status: 'new' });
    const readQueries = await ContactQuery.countDocuments({ status: 'read' });
    const repliedQueries = await ContactQuery.countDocuments({ status: 'replied' });
    const archivedQueries = await ContactQuery.countDocuments({ status: 'archived' });

    // Queries by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await ContactQuery.aggregate([
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
          total: totalQueries,
          new: newQueries,
          read: readQueries,
          replied: repliedQueries,
          archived: archivedQueries
        },
        monthly: monthlyStats
      }
    });

  } catch (error) {
    console.error('Error fetching contact queries stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

module.exports = router;
