const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');

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
app.use('/api/contact-queries', require('./routes/contactQueries'));
app.use('/api/eligibility-queries', require('./routes/eligibilityQueries'));

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
  
  // Start keepalive ping for Render free tier (prevents cold starts)
  startKeepAlive();
});

// Keepalive function to ping the API every 10 minutes
// This prevents Render free tier from spinning down the service
function startKeepAlive() {
  // Only run in production (when deployed)
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    console.log('⏭️  Keepalive disabled in development mode');
    return;
  }

  // Get the API URL from environment variable or use default Render URL
  const API_URL = process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'https://crednest-backend.onrender.com';
  
  // Extract hostname and path from URL
  let url;
  try {
    url = new URL(API_URL);
  } catch (error) {
    console.error('❌ Invalid API URL for keepalive:', API_URL);
    return;
  }

  const hostname = url.hostname;
  const path = '/ping'; // Use the simple ping endpoint
  const protocol = url.protocol === 'https:' ? https : http;
  const port = url.port || (url.protocol === 'https:' ? 443 : 80);

  console.log(`🔄 Keepalive started - pinging ${API_URL}${path} every 10 minutes`);

  // Function to ping the API
  const pingAPI = () => {
    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: 'GET',
      timeout: 10000, // 10 second timeout
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const timestamp = new Date().toISOString();
        if (res.statusCode === 200) {
          console.log(`✅ Keepalive ping successful at ${timestamp}`);
        } else {
          console.log(`⚠️  Keepalive ping returned status ${res.statusCode} at ${timestamp}`);
        }
      });
    });

    req.on('error', (error) => {
      const timestamp = new Date().toISOString();
      console.error(`❌ Keepalive ping failed at ${timestamp}:`, error.message);
    });

    req.on('timeout', () => {
      req.destroy();
      const timestamp = new Date().toISOString();
      console.error(`⏱️  Keepalive ping timeout at ${timestamp}`);
    });

    req.end();
  };

  // Ping immediately on startup (after 5 seconds to ensure server is ready)
  setTimeout(() => {
    console.log('🔄 Initial keepalive ping...');
    pingAPI();
  }, 5000);

  // Then ping every 10 minutes (600,000 milliseconds)
  const KEEPALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes
  setInterval(() => {
    pingAPI();
  }, KEEPALIVE_INTERVAL);

  console.log(`⏰ Keepalive interval set to ${KEEPALIVE_INTERVAL / 1000 / 60} minutes`);
}
