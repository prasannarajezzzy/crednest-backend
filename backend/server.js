const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with improved settings for deployment platforms
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority&appName=CrediNest';

// Simplified connection options for better compatibility
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds (increased from default 10s)
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
  family: 4, // Use IPv4, skip trying IPv6
};

// Connect to MongoDB with simplified approach
mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Server will continue running, but database operations will fail');
  });

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Routes
app.use('/api/loan-applications', require('./routes/loanApplications'));
app.use('/api/auth', require('./routes/auth'));

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      database: {
        status: 'unknown',
        connected: false
      }
    };

    // Check database connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.database.status = 'connected';
      healthCheck.database.connected = true;
    } else if (mongoose.connection.readyState === 2) {
      healthCheck.database.status = 'connecting';
      healthCheck.database.connected = false;
    } else if (mongoose.connection.readyState === 0) {
      healthCheck.database.status = 'disconnected';
      healthCheck.database.connected = false;
    }

    // If database is not connected, return 503
    if (!healthCheck.database.connected) {
      healthCheck.status = 'ERROR';
      return res.status(503).json(healthCheck);
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: Math.floor(process.uptime())
    });
  }
});

// Simple health check for load balancers (faster response)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Readiness check (for Kubernetes/Docker)
app.get('/ready', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CredNest Backend API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Handle 404 - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
