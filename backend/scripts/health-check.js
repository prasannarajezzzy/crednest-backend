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

