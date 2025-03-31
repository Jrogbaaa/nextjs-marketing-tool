const { createClient } = require('@supabase/supabase-js');

// Create a single Supabase client for interacting with the database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('Supabase credentials not found. Database operations will fail.');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

/**
 * Get all leads with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.pageSize=10] - Items per page
 * @param {Object} [options.filterBy={}] - Filter criteria
 * @param {string} [options.sortBy='created_at'] - Sort field
 * @param {string} [options.sortDirection='desc'] - Sort direction
 * @returns {Promise<Object>} - Leads data and count
 */
async function getLeads({
  page = 1,
  pageSize = 10,
  filterBy = {},
  sortBy = 'created_at',
  sortDirection = 'desc'
} = {}) {
  if (!supabase) {
    return { data: null, count: null, error: 'Supabase client not initialized' };
  }

  try {
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start query
    let query = supabase.from('leads')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order(sortBy, { ascending: sortDirection === 'asc' });

    // Apply filters
    Object.entries(filterBy).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'skills' && Array.isArray(value)) {
          // Handle array overlap for skills
          query = query.contains(key, value);
        } else if (typeof value === 'string') {
          // Text search for string values
          query = query.ilike(key, `%${value}%`);
        } else {
          // Exact match for other types
          query = query.eq(key, value);
        }
      }
    });

    const { data, error, count } = await query;
    return { data, count, error };
  } catch (error) {
    console.error('Error fetching leads:', error);
    return { data: null, count: null, error: error.message };
  }
}

/**
 * Get a single lead by ID
 * @param {string} id - Lead ID
 * @returns {Promise<Object>} - Lead data
 */
async function getLeadById(id) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error fetching lead ${id}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Create a new lead
 * @param {Object} lead - Lead data
 * @returns {Promise<Object>} - Created lead
 */
async function createLead(lead) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    // Add timestamps
    const leadWithTimestamps = {
      ...lead,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([leadWithTimestamps])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Update a lead
 * @param {string} id - Lead ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated lead
 */
async function updateLead(id, updates) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    // Add updated_at timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leads')
      .update(updatesWithTimestamp)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error updating lead ${id}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Delete a lead
 * @param {string} id - Lead ID
 * @returns {Promise<Object>} - Result
 */
async function deleteLead(id) {
  if (!supabase) {
    return { error: 'Supabase client not initialized' };
  }

  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    console.error(`Error deleting lead ${id}:`, error);
    return { error: error.message };
  }
}

/**
 * Get insights for a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} - Insights data
 */
async function getInsightsForLead(leadId) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error(`Error fetching insights for lead ${leadId}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Create a new insight
 * @param {Object} insight - Insight data
 * @returns {Promise<Object>} - Created insight
 */
async function createInsight(insight) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    // Add timestamps
    const insightWithTimestamps = {
      ...insight,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('insights')
      .insert([insightWithTimestamps])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating insight:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Import leads from Phantombuster data
 * @param {Array} scrapeData - Array of scraped profiles
 * @returns {Promise<Object>} - Import results
 */
async function importLeadsFromPhantombuster(scrapeData) {
  let successful = 0;
  let failed = 0;
  const errors = [];

  if (!supabase) {
    return { successful, failed, errors: ['Supabase client not initialized'] };
  }

  // Process each scraped profile
  for (const profile of scrapeData) {
    try {
      // Extract and format the lead data
      const lead = {
        name: profile.name || 'Unknown',
        title: profile.title || 'Unknown',
        company: profile.company || profile.currentCompany || 'Unknown',
        location: profile.location || 'Unknown',
        profile_url: profile.profileUrl || profile.url || '',
        summary: profile.summary || profile.description || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        connections: parseInt(profile.connections?.replace(/\D/g, '')) || 0,
        connection_degree: profile.connectionDegree || null,
        analyzed: false,
        scrape_data: profile
      };

      // Check if lead already exists by profile URL
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, profile_url')
        .eq('profile_url', lead.profile_url)
        .maybeSingle();

      let result;
      
      if (existingLead) {
        // Update existing lead
        result = await updateLead(existingLead.id, {
          ...lead,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new lead
        result = await createLead(lead);
      }

      if (result.error) {
        failed++;
        errors.push({
          profile: profile.profileUrl || profile.url,
          error: result.error.message
        });
      } else {
        successful++;
      }
    } catch (error) {
      failed++;
      errors.push({
        profile: profile.profileUrl || profile.url || 'Unknown',
        error: error.message
      });
    }
  }

  return { successful, failed, errors };
}

/**
 * Add feedback for an insight
 * @param {Object} feedback - Feedback data
 * @returns {Promise<Object>} - Created feedback
 */
async function addFeedback(feedback) {
  if (!supabase) {
    return { data: null, error: 'Supabase client not initialized' };
  }

  try {
    // Add timestamps
    const feedbackWithTimestamps = {
      ...feedback,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackWithTimestamps])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error adding feedback:', error);
    return { data: null, error: error.message };
  }
}

module.exports = {
  supabase,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getInsightsForLead,
  createInsight,
  importLeadsFromPhantombuster,
  addFeedback
}; 