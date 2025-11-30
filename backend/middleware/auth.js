const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Check if admin still exists
    const admin = await Admin.findById(decoded.admin.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found, authorization denied'
      });
    }

    req.admin = decoded.admin;
    next();
  } catch (error) {
    // Only log non-expiration errors to reduce noise
    if (error.name !== 'TokenExpiredError') {
      console.error('Auth middleware error:', error);
    }
    
    // Provide more specific error message
    const message = error.name === 'TokenExpiredError' 
      ? 'Token expired, please login again'
      : 'Token is not valid';
    
    res.status(401).json({
      success: false,
      message,
      expired: error.name === 'TokenExpiredError'
    });
  }
};
