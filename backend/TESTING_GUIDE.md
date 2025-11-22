# CredNest Backend Testing & Monitoring Guide

## 🧪 Testing Your Deployed Backend

### 1. Quick Health Check

Test if your backend is running:

```bash
# Replace with your actual deployed URL
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### 2. API Endpoint Testing

#### Test Root Endpoint
```bash
curl https://your-backend-url.com/
```

Expected response:
```json
{
  "message": "CredNest Backend API is running!",
  "version": "1.0.0",
  "environment": "production"
}
```

#### Test Admin Login
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crednest.com",
    "password": "admin123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@crednest.com",
    "role": "admin"
  }
}
```

#### Test Protected Route (Loan Applications)
```bash
# First get the token from login, then:
curl -X GET https://your-backend-url.com/api/loan-applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 3. Load Testing with curl

Test multiple requests:
```bash
# Simple load test (10 requests)
for i in {1..10}; do
  curl -s https://your-backend-url.com/health > /dev/null
  echo "Request $i completed"
done
```

### 4. Database Connection Testing

Create a test loan application:
```bash
curl -X POST https://your-backend-url.com/api/loan-applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "personalInfo": {
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "dateOfBirth": "1990-01-01",
      "ssn": "123-45-6789",
      "address": {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipCode": "12345"
      }
    },
    "loanDetails": {
      "loanAmount": 10000,
      "loanPurpose": "Testing",
      "loanTerm": 12
    },
    "employmentInfo": {
      "employmentStatus": "employed",
      "employer": "Test Company",
      "jobTitle": "Tester",
      "monthlyIncome": 5000,
      "employmentLength": "2 years"
    }
  }'
```

---

## 📊 Monitoring Your Backend

### 1. Built-in Monitoring

#### Platform-Specific Dashboards

**Render:**
- Go to your service dashboard
- View logs, metrics, and deployments
- Set up alerts for downtime

**Railway:**
- Check the metrics tab
- Monitor CPU, memory, and network usage
- View real-time logs

**Vercel:**
- Functions tab shows execution logs
- Analytics for performance metrics
- Error tracking built-in

**Heroku:**
- Use Heroku metrics dashboard
- Add-ons for advanced monitoring
- Log aggregation with Papertrail

### 2. Free Uptime Monitoring

#### UptimeRobot Setup
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add HTTP(s) monitor:
   - URL: `https://your-backend-url.com/health`
   - Interval: 5 minutes
   - Alert contacts: Your email

#### Pingdom Setup
1. Go to [pingdom.com](https://pingdom.com)
2. Sign up for free trial
3. Create uptime check:
   - URL: `https://your-backend-url.com/health`
   - Check interval: 1 minute

### 3. Error Tracking

#### Sentry Integration (Recommended)

Install Sentry:
```bash
npm install @sentry/node @sentry/tracing
```

Add to your `server.js`:
```javascript
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// Add Sentry middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Add error handler (before other error handlers)
app.use(Sentry.Handlers.errorHandler());
```

### 4. Performance Monitoring

#### Response Time Monitoring
Add to your routes:
```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
```

#### Memory Usage Monitoring
```javascript
app.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    },
    uptime: `${Math.round(process.uptime())} seconds`,
    cpu: process.cpuUsage()
  });
});
```

---

## 🔍 Log Management

### 1. Structured Logging

Install Winston for better logging:
```bash
npm install winston
```

Create `logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'crednest-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

Use in your application:
```javascript
const logger = require('./logger');

// Instead of console.log
logger.info('Server started', { port: PORT });
logger.error('Database connection failed', { error: err.message });
```

### 2. Log Aggregation Services

#### LogTail (Recommended for small apps)
1. Sign up at [logtail.com](https://logtail.com)
2. Get your source token
3. Install the transport:
```bash
npm install @logtail/winston
```

#### Papertrail (Heroku users)
1. Add Papertrail add-on in Heroku
2. View logs in Papertrail dashboard
3. Set up alerts for errors

---

## 🚨 Alerting & Notifications

### 1. Email Alerts

Set up email notifications for:
- Server downtime (via UptimeRobot)
- Error rate spikes (via Sentry)
- High memory usage
- Database connection issues

### 2. Slack Integration

#### Webhook Setup
1. Create Slack webhook URL
2. Add to environment variables:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

3. Create notification function:
```javascript
const axios = require('axios');

async function sendSlackAlert(message) {
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `🚨 CredNest Backend Alert: ${message}`
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }
}

// Use in error handlers
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  sendSlackAlert(`Error in ${req.path}: ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
});
```

---

## 📈 Analytics & Insights

### 1. API Usage Analytics

Track API usage:
```javascript
const apiStats = {
  requests: 0,
  errors: 0,
  endpoints: {}
};

app.use((req, res, next) => {
  apiStats.requests++;
  
  const endpoint = `${req.method} ${req.path}`;
  apiStats.endpoints[endpoint] = (apiStats.endpoints[endpoint] || 0) + 1;
  
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      apiStats.errors++;
    }
    originalSend.call(this, data);
  };
  
  next();
});

app.get('/analytics', (req, res) => {
  res.json({
    ...apiStats,
    errorRate: apiStats.requests > 0 ? (apiStats.errors / apiStats.requests * 100).toFixed(2) + '%' : '0%',
    uptime: process.uptime()
  });
});
```

### 2. Database Performance

Monitor MongoDB performance:
```javascript
// Add to your MongoDB connection
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message });
  sendSlackAlert(`Database connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
  sendSlackAlert('Database disconnected');
});
```

---

## 🔧 Automated Testing Scripts

### 1. Health Check Script

Create `scripts/health-check.js`:
```javascript
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function healthCheck() {
  try {
    console.log('🏥 Running health check...');
    
    const response = await axios.get(`${BACKEND_URL}/health`);
    
    if (response.status === 200) {
      console.log('✅ Health check passed');
      console.log('📊 Status:', response.data);
      return true;
    } else {
      console.log('❌ Health check failed - Status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed - Error:', error.message);
    return false;
  }
}

async function fullTest() {
  console.log('🧪 Running full API test...');
  
  try {
    // Test login
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'admin@crednest.com',
      password: 'admin123'
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ Login test passed');
      
      const token = loginResponse.data.token;
      
      // Test protected route
      const appsResponse = await axios.get(`${BACKEND_URL}/api/loan-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (appsResponse.status === 200) {
        console.log('✅ Protected route test passed');
        console.log('📊 Found', appsResponse.data.length, 'loan applications');
      }
    }
    
    console.log('🎉 All tests passed!');
    return true;
    
  } catch (error) {
    console.log('❌ API test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const healthPassed = await healthCheck();
  
  if (healthPassed) {
    await fullTest();
  }
  
  process.exit(healthPassed ? 0 : 1);
}

runTests();
```

### 2. Load Test Script

Create `scripts/load-test.js`:
```javascript
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 100;

async function loadTest() {
  console.log(`🚀 Starting load test: ${TOTAL_REQUESTS} requests with ${CONCURRENT_REQUESTS} concurrent`);
  
  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;
  
  const promises = [];
  
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const promise = axios.get(`${BACKEND_URL}/health`)
      .then(() => {
        successCount++;
        process.stdout.write('✅');
      })
      .catch(() => {
        errorCount++;
        process.stdout.write('❌');
      });
    
    promises.push(promise);
    
    // Control concurrency
    if (promises.length >= CONCURRENT_REQUESTS) {
      await Promise.all(promises);
      promises.length = 0;
    }
  }
  
  // Wait for remaining requests
  await Promise.all(promises);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n\n📊 Load Test Results:');
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Success Rate: ${(successCount / TOTAL_REQUESTS * 100).toFixed(2)}%`);
  console.log(`Total Time: ${duration}ms`);
  console.log(`Average Response Time: ${(duration / TOTAL_REQUESTS).toFixed(2)}ms`);
  console.log(`Requests per Second: ${(TOTAL_REQUESTS / (duration / 1000)).toFixed(2)}`);
}

loadTest();
```

Add to `package.json`:
```json
{
  "scripts": {
    "health-check": "node scripts/health-check.js",
    "load-test": "node scripts/load-test.js"
  }
}
```

---

## 🎯 Production Checklist

### Before Going Live:

- [ ] **Security**
  - [ ] Change default admin password
  - [ ] Use strong JWT secret (32+ characters)
  - [ ] Enable HTTPS only
  - [ ] Set up CORS properly
  - [ ] Add rate limiting
  - [ ] Input validation on all endpoints

- [ ] **Monitoring**
  - [ ] Set up uptime monitoring
  - [ ] Configure error tracking (Sentry)
  - [ ] Set up log aggregation
  - [ ] Create health check endpoint
  - [ ] Set up alerts for critical issues

- [ ] **Performance**
  - [ ] Database indexing
  - [ ] Response compression
  - [ ] Caching strategy
  - [ ] Load testing completed
  - [ ] Memory leak testing

- [ ] **Backup & Recovery**
  - [ ] Database backup strategy
  - [ ] Environment variable backup
  - [ ] Deployment rollback plan
  - [ ] Disaster recovery documentation

- [ ] **Documentation**
  - [ ] API documentation
  - [ ] Deployment procedures
  - [ ] Monitoring runbooks
  - [ ] Emergency contacts

---

## 🆘 Troubleshooting Common Issues

### 1. High Memory Usage
```bash
# Check memory usage
curl https://your-backend-url.com/metrics

# Solutions:
# - Restart the service
# - Check for memory leaks
# - Optimize database queries
# - Add pagination to large responses
```

### 2. Database Connection Issues
```bash
# Check MongoDB Atlas network access
# Verify connection string format
# Check database user permissions
# Monitor connection pool size
```

### 3. Slow Response Times
```bash
# Check database query performance
# Add database indexes
# Implement caching
# Optimize API responses
```

### 4. High Error Rates
```bash
# Check application logs
# Monitor specific error patterns
# Verify input validation
# Check third-party service status
```

---

**Remember:** Monitor your application continuously and set up alerts for critical metrics. Regular testing and monitoring will help you catch issues before they affect users!
