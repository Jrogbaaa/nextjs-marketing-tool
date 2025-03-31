require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('=== Testing Supabase Connection ===');
  
  try {
    // Check if credentials are available
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Error: Supabase credentials are missing. Please check your .env file.');
      return;
    }

    console.log('🔄 Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Testing database connection...');
    
    // Check if we can connect to Supabase by making a simple query
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
      
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ Successfully connected to Supabase!');
    
    // Test creating a table if it doesn't exist using SQL
    console.log('\n🔄 Testing SQL execution capabilities...');
    
    const { error: sqlError } = await supabase.rpc('test_connection');
    
    if (sqlError) {
      console.log('ℹ️ Could not execute RPC function (may not be defined yet).');
      console.log('ℹ️ This is expected if you haven\'t set up the schema yet.');
    } else {
      console.log('✅ Successfully executed SQL command!');
    }
    
    // Test schema
    console.log('\n🔄 Fetching database schema information...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (tablesError) {
      console.log('ℹ️ Could not fetch schema information. This is normal if your permissions are limited.');
    } else {
      console.log('✅ Database tables found:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
    // Test inserting a mock lead
    console.log('\n🔄 Testing data insertion with a mock lead...');
    
    const mockLead = {
      name: 'Test User',
      title: 'QA Engineer',
      company: 'Test Company',
      location: 'Test Location',
      profile_url: `https://linkedin.com/in/test-user-${Date.now()}`,
      summary: 'This is a test user for API connection testing.',
      skills: ['Testing', 'QA', 'API'],
      connections: 100,
      connection_degree: 2,
      is_test_data: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([mockLead])
      .select();
      
    if (insertError) {
      console.log(`ℹ️ Could not insert test data: ${insertError.message}`);
      console.log('ℹ️ This is expected if the table structure is not set up yet.');
    } else {
      console.log('✅ Successfully inserted test data!');
      console.log(`   Lead ID: ${insertData[0].id}`);
      
      // Clean up test data
      console.log('🔄 Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', insertData[0].id);
        
      if (!deleteError) {
        console.log('✅ Successfully cleaned up test data.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Supabase connection:');
    console.error(error.message);
  }
}

// Run the test
testSupabaseConnection(); 