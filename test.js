require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const axios = require('axios');

// Test all connections
async function testAllConnections() {
  console.log('=== LinkedIn Lead Analysis API Test ===');
  console.log('Testing all API connections...\n');
  
  try {
    await testSupabase();
    console.log('\n---------------------------------\n');
    await testOpenAI();
    console.log('\n---------------------------------\n');
    await testPhantombuster();
    
    console.log('\n=== All API tests completed successfully! ===');
  } catch (error) {
    console.error('\n⚠️ One or more API tests failed. See errors above.');
    process.exit(1);
  }
}

// Test Supabase connection
async function testSupabase() {
  console.log('🔵 Testing Supabase Connection...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials. Check your .env file.');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Simple query to test connection
  const { data, error } = await supabase.from('leads').select('count').limit(1);
  
  if (error) {
    throw new Error(`Supabase connection error: ${error.message}`);
  }
  
  console.log('✅ Successfully connected to Supabase!');
  return true;
}

// Test OpenAI connection
async function testOpenAI() {
  console.log('🔵 Testing OpenAI Connection...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Check your .env file.');
  }
  
  const openai = new OpenAI({
    apiKey: apiKey
  });
  
  // Simple completion to test connection
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system", 
        content: "You are a helpful assistant."
      },
      {
        role: "user", 
        content: "Say hello world."
      }
    ],
    max_tokens: 50
  });
  
  console.log('✅ Successfully connected to OpenAI!');
  console.log(`Response: "${response.choices[0].message.content}"`);
  return true;
}

// Test Phantombuster connection
async function testPhantombuster() {
  console.log('🔵 Testing Phantombuster Connection...');
  
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  const containerId = process.env.PHANTOMBUSTER_LINKEDIN_CONTAINER_ID;
  
  if (!apiKey || !containerId) {
    throw new Error('Missing Phantombuster credentials. Check your .env file.');
  }
  
  // Test connection by getting agent info
  const response = await axios({
    method: 'GET',
    url: `https://api.phantombuster.com/api/v2/agents/${containerId}`,
    headers: {
      'X-Phantombuster-Key': apiKey
    }
  });
  
  console.log('✅ Successfully connected to Phantombuster!');
  console.log(`Agent name: ${response.data.name}`);
  console.log(`Agent status: ${response.data.status}`);
  return true;
}

// Run all tests
testAllConnections(); 