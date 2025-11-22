// Configuration for CredNest Backend
// Copy this to .env file in the backend directory

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  
  // Database Configuration
  // For Local MongoDB:
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/CredNest',
  
  // For MongoDB Atlas (replace with your connection string):
  // MONGODB_URI: 'mongodb+srv://username:password@cluster.xxxxx.mongodb.net/CredNest?retryWrites=true&w=majority',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  
  // Default Admin Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@CredNest.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
};

// Create a .env file with these variables:
/*
PORT=5000
MONGODB_URI=mongodb://localhost:27017/CredNest
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@CredNest.com
ADMIN_PASSWORD=admin123
*/
