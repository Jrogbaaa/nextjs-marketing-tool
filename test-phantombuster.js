require('dotenv').config();
const axios = require('axios');

async function testPhantombusterConnection() {
  console.log('Testing Phantombuster Connection...');
  
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  const containerId = process.env.PHANTOMBUSTER_LINKEDIN_CONTAINER_ID;
  
  if (!apiKey || !containerId) {
    console.error('Missing Phantombuster credentials. Check your .env file.');
    process.exit(1);
  }
  
  try {
    // Test connection by getting agent info
    const response = await axios({
      method: 'GET',
      url: `https://api.phantombuster.com/api/v2/agents/${containerId}`,
      headers: {
        'X-Phantombuster-Key': apiKey
      }
    });
    
    console.log('Successfully connected to Phantombuster!');
    console.log('Agent info:', {
      name: response.data.name,
      id: response.data.id,
      status: response.data.status
    });
    
  } catch (err) {
    console.error('Error connecting to Phantombuster:', err.response?.data || err.message);
    process.exit(1);
  }
}

// Run the test
testPhantombusterConnection(); 