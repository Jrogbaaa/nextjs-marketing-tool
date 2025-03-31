require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function setupDatabase() {
  console.log('=== Setting up LinkedIn Lead Analysis Database ===');
  
  try {
    // Check if credentials are available
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for schema creation
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Error: Supabase credentials are missing. Please check your .env file.');
      console.error('   Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined.');
      return;
    }

    console.log('🔄 Initializing Supabase client with service role...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create the leads table
    console.log('\n🔄 Creating leads table...');
    const { error: leadsError } = await supabase.rpc('create_leads_table', {});
    
    if (leadsError) {
      console.log('ℹ️ Using SQL fallback for leads table creation...');
      
      const { error: sqlLeadsError } = await supabase.from('leads')
        .select('count')
        .limit(1)
        .catch(async () => {
          // Table doesn't exist, create it
          return await supabase.sql(`
            CREATE TABLE IF NOT EXISTS public.leads (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              title TEXT NOT NULL,
              company TEXT NOT NULL,
              location TEXT NOT NULL,
              profile_url TEXT UNIQUE NOT NULL,
              summary TEXT,
              skills TEXT[] DEFAULT '{}',
              experience JSONB[] DEFAULT '{}',
              education JSONB[] DEFAULT '{}',
              connections INTEGER DEFAULT 0,
              connection_degree INTEGER,
              analyzed BOOLEAN DEFAULT FALSE,
              is_test_data BOOLEAN DEFAULT FALSE,
              scrape_data JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS leads_analyzed_idx ON public.leads(analyzed);
            CREATE INDEX IF NOT EXISTS leads_company_idx ON public.leads(company);
          `);
        });
      
      if (sqlLeadsError) {
        console.error(`❌ Error creating leads table: ${sqlLeadsError.message}`);
      } else {
        console.log('✅ Successfully created or verified leads table!');
      }
    } else {
      console.log('✅ Successfully created or verified leads table!');
    }
    
    // Create the insights table
    console.log('\n🔄 Creating insights table...');
    const { error: insightsError } = await supabase.rpc('create_insights_table', {});
    
    if (insightsError) {
      console.log('ℹ️ Using SQL fallback for insights table creation...');
      
      const { error: sqlInsightsError } = await supabase.from('insights')
        .select('count')
        .limit(1)
        .catch(async () => {
          // Table doesn't exist, create it
          return await supabase.sql(`
            CREATE TABLE IF NOT EXISTS public.insights (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
              type TEXT NOT NULL,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              confidence_score FLOAT NOT NULL,
              action_points TEXT[] DEFAULT '{}',
              related_insights UUID[] DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS insights_lead_id_idx ON public.insights(lead_id);
            CREATE INDEX IF NOT EXISTS insights_type_idx ON public.insights(type);
          `);
        });
      
      if (sqlInsightsError) {
        console.error(`❌ Error creating insights table: ${sqlInsightsError.message}`);
      } else {
        console.log('✅ Successfully created or verified insights table!');
      }
    } else {
      console.log('✅ Successfully created or verified insights table!');
    }
    
    // Create the feedback table
    console.log('\n🔄 Creating feedback table...');
    const { error: feedbackError } = await supabase.rpc('create_feedback_table', {});
    
    if (feedbackError) {
      console.log('ℹ️ Using SQL fallback for feedback table creation...');
      
      const { error: sqlFeedbackError } = await supabase.from('feedback')
        .select('count')
        .limit(1)
        .catch(async () => {
          // Table doesn't exist, create it
          return await supabase.sql(`
            CREATE TABLE IF NOT EXISTS public.feedback (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              insight_id UUID REFERENCES public.insights(id) ON DELETE CASCADE,
              lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
              rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
              comment TEXT,
              created_by TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS feedback_insight_id_idx ON public.feedback(insight_id);
            CREATE INDEX IF NOT EXISTS feedback_lead_id_idx ON public.feedback(lead_id);
          `);
        });
      
      if (sqlFeedbackError) {
        console.error(`❌ Error creating feedback table: ${sqlFeedbackError.message}`);
      } else {
        console.log('✅ Successfully created or verified feedback table!');
      }
    } else {
      console.log('✅ Successfully created or verified feedback table!');
    }
    
    // Create updateable views if needed
    
    // Create RPC function for test_connection
    console.log('\n🔄 Creating test_connection function...');
    const { error: rpcError } = await supabase.sql(`
      CREATE OR REPLACE FUNCTION public.test_connection()
      RETURNS bool
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN true;
      END;
      $$;
    `);
    
    if (rpcError) {
      console.error(`❌ Error creating test_connection function: ${rpcError.message}`);
    } else {
      console.log('✅ Successfully created test_connection function!');
    }
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now run the application and test the connections.');
    
  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
  }
}

// Run the setup
setupDatabase(); 