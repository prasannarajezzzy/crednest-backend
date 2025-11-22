const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function healthCheck() {
  try {
    console.log('🏥 Running comprehensive health check...');
    
    // Test main health endpoint
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Main health check passed');
      console.log('📊 Health Status:', {
        status: healthResponse.data.status,
        uptime: `${healthResponse.data.uptime}s`,
        memory: `${healthResponse.data.memory?.used}MB used`,
        database: healthResponse.data.database?.status,
        environment: healthResponse.data.environment
      });
    } else {
      console.log('❌ Health check failed - Status:', healthResponse.status);
      return false;
    }

    // Test ping endpoint
    const pingResponse = await axios.get(`${BACKEND_URL}/ping`);
    if (pingResponse.status === 200 && pingResponse.data === 'pong') {
      console.log('✅ Ping test passed');
    } else {
      console.log('⚠️  Ping test failed');
    }

    // Test readiness endpoint
    const readyResponse = await axios.get(`${BACKEND_URL}/ready`);
    if (readyResponse.status === 200) {
      console.log('✅ Readiness check passed');
    } else {
      console.log('⚠️  Readiness check failed - Service not ready');
    }

    return true;
  } catch (error) {
    console.log('❌ Health check failed - Error:', error.message);
    if (error.response) {
      console.log('📊 Error details:', error.response.data);
    }
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

