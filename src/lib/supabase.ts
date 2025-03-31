import { createClient } from '@supabase/supabase-js';

// Types for our database schema
export type Lead = {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  profile_url: string;
  summary?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  connections?: number;
  connection_degree?: number;
  analyzed: boolean;
  is_test_data?: boolean;
  scrape_data?: any;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  lead_id: string;
  type: string;
  title: string;
  content: string;
  confidence_score: number;
  action_points?: string[];
  related_insights?: string[];
  created_at: string;
  updated_at: string;
};

export type Feedback = {
  id: string;
  insight_id: string;
  lead_id: string;
  rating: number;
  comment?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

// Type definitions for our database
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;
      };
      insights: {
        Row: Insight;
        Insert: Omit<Insight, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Insight, 'id' | 'created_at' | 'updated_at'>>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {
      test_connection: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Utility functions for working with leads
export async function getLeads({
  page = 1,
  pageSize = 10,
  filterBy = {},
  sortBy = 'created_at',
  sortDirection = 'desc'
}: {
  page?: number;
  pageSize?: number;
  filterBy?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
} = {}): Promise<{ data: Lead[] | null; count: number | null; error: any }> {
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
}

// Get a single lead by ID
export async function getLeadById(id: string): Promise<{ data: Lead | null; error: any }> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

// Create a new lead
export async function createLead(lead: Database['public']['Tables']['leads']['Insert']): Promise<{ data: Lead | null; error: any }> {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  return { data, error };
}

// Update a lead
export async function updateLead(id: string, updates: Database['public']['Tables']['leads']['Update']): Promise<{ data: Lead | null; error: any }> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

// Delete a lead
export async function deleteLead(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  return { error };
}

// Get insights for a lead
export async function getInsightsForLead(leadId: string): Promise<{ data: Insight[] | null; error: any }> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Create a new insight
export async function createInsight(insight: Database['public']['Tables']['insights']['Insert']): Promise<{ data: Insight | null; error: any }> {
  const { data, error } = await supabase
    .from('insights')
    .insert([insight])
    .select()
    .single();

  return { data, error };
}

// Add feedback for an insight
export async function addFeedback(feedback: Database['public']['Tables']['feedback']['Insert']): Promise<{ data: Feedback | null; error: any }> {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedback])
    .select()
    .single();

  return { data, error };
}

// Utility function to import leads from a Phantombuster JSON export
export async function importLeadsFromPhantombuster(scrapeData: any[]): Promise<{ successful: number; failed: number; errors: any[] }> {
  let successful = 0;
  let failed = 0;
  const errors: any[] = [];

  // Process each scraped profile
  for (const profile of scrapeData) {
    try {
      // Extract and format the lead data
      const lead: Database['public']['Tables']['leads']['Insert'] = {
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
    } catch (error: any) {
      failed++;
      errors.push({
        profile: profile.profileUrl || profile.url || 'Unknown',
        error: error.message
      });
    }
  }

  return { successful, failed, errors };
}

export default supabase;

// Admin client with additional privileges (to be used server-side only)
export const createAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables');
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}; 